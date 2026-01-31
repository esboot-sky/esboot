use swc_core::ecma::{
    ast::*,
    visit::{as_folder, FoldWith, VisitMut, VisitMutWith},
};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};
use serde::Deserialize;
use std::collections::HashMap;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    /// Hash pattern for generating scoped class names
    /// Example: "[name]__[local]___[hash:base64:5]"
    #[serde(default = "default_hash_pattern")]
    pub hash_pattern: String,
}

fn default_hash_pattern() -> String {
    "[name]__[local]___[hash:base64:5]".to_string()
}

pub struct StyleNameTransformer {
    /// Tracks style imports found in the module
    style_imports: Vec<StyleImport>,
    /// Hash pattern for generating scoped class names
    hash_pattern: String,
}

#[derive(Debug, Clone)]
struct StyleImport {
    /// Path to the style file
    path: String,
    /// Variable name for the imported styles (if any)
    variable: Option<String>,
}

impl StyleNameTransformer {
    pub fn new(config: Config) -> Self {
        Self {
            style_imports: Vec::new(),
            hash_pattern: config.hash_pattern,
        }
    }

    /// Check if an import is a style import (.scss file)
    fn is_style_import(&self, src: &str) -> bool {
        src.ends_with(".scss") && !src.contains("styles/")
    }

    /// Generate a scoped class name based on the hash pattern
    /// This is a simplified version - in production, you'd want to
    /// actually hash the content and apply the pattern
    fn generate_scoped_name(&self, class_name: &str, file_path: &str) -> String {
        // Simplified implementation - just return the class name for now
        // In a real implementation, you would:
        // 1. Parse the hash_pattern
        // 2. Replace [name] with the file name
        // 3. Replace [local] with the class_name
        // 4. Replace [hash:base64:5] with a hash of the content
        format!("{}_{}", class_name, "hash")
    }
}

impl VisitMut for StyleNameTransformer {
    /// Visit module items to detect style imports
    fn visit_mut_module_item(&mut self, node: &mut ModuleItem) {
        if let ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) = node {
            let src = import_decl.src.value.to_string();
            
            if self.is_style_import(&src) {
                // Extract variable name if present
                let variable = import_decl.specifiers.first().and_then(|spec| {
                    match spec {
                        ImportSpecifier::Default(default) => {
                            Some(default.local.sym.to_string())
                        }
                        ImportSpecifier::Namespace(ns) => {
                            Some(ns.local.sym.to_string())
                        }
                        _ => None,
                    }
                });

                self.style_imports.push(StyleImport {
                    path: src.clone(),
                    variable,
                });
            }
        }

        node.visit_mut_children_with(self);
    }

    /// Visit JSX elements to transform styleName to className
    fn visit_mut_jsx_element(&mut self, node: &mut JSXElement) {
        // Only process if we have style imports
        if !self.style_imports.is_empty() {
            let mut style_name_value: Option<String> = None;
            let mut class_name_value: Option<String> = None;
            let mut style_name_index: Option<usize> = None;
            let mut class_name_index: Option<usize> = None;

            // Find styleName and className attributes
            for (i, attr) in node.opening.attrs.iter().enumerate() {
                if let JSXAttrOrSpread::JSXAttr(jsx_attr) = attr {
                    if let JSXAttrName::Ident(ident) = &jsx_attr.name {
                        let attr_name = ident.sym.to_string();
                        
                        if attr_name == "styleName" {
                            style_name_index = Some(i);
                            if let Some(JSXAttrValue::Lit(Lit::Str(s))) = &jsx_attr.value {
                                style_name_value = Some(s.value.to_string());
                            }
                        } else if attr_name == "className" {
                            class_name_index = Some(i);
                            if let Some(JSXAttrValue::Lit(Lit::Str(s))) = &jsx_attr.value {
                                class_name_value = Some(s.value.to_string());
                            }
                        }
                    }
                }
            }

            // Transform styleName to className
            if let Some(style_name) = style_name_value {
                // Generate scoped class names
                let scoped_classes: Vec<String> = style_name
                    .split_whitespace()
                    .map(|class| {
                        // For each style import, generate the scoped name
                        self.style_imports
                            .iter()
                            .map(|import| self.generate_scoped_name(class, &import.path))
                            .collect::<Vec<_>>()
                            .join(" ")
                    })
                    .collect();

                // Merge with existing className
                let final_class_name = if let Some(existing) = class_name_value {
                    format!("{} {}", existing, scoped_classes.join(" "))
                } else {
                    scoped_classes.join(" ")
                };

                // Update or add className attribute
                if let Some(idx) = class_name_index {
                    // Update existing className
                    if let JSXAttrOrSpread::JSXAttr(jsx_attr) = &mut node.opening.attrs[idx] {
                        jsx_attr.value = Some(JSXAttrValue::Lit(Lit::Str(Str {
                            span: Default::default(),
                            value: final_class_name.into(),
                            raw: None,
                        })));
                    }
                } else {
                    // Add new className attribute
                    node.opening.attrs.push(JSXAttrOrSpread::JSXAttr(JSXAttr {
                        span: Default::default(),
                        name: JSXAttrName::Ident(Ident::new("className".into(), Default::default())),
                        value: Some(JSXAttrValue::Lit(Lit::Str(Str {
                            span: Default::default(),
                            value: final_class_name.into(),
                            raw: None,
                        }))),
                    }));
                }

                // Remove styleName attribute
                if let Some(idx) = style_name_index {
                    node.opening.attrs.remove(idx);
                }
            }
        }

        node.visit_mut_children_with(self);
    }
}

#[plugin_transform]
pub fn process_transform(program: Program, metadata: TransformPluginProgramMetadata) -> Program {
    let config = serde_json::from_str::<Config>(
        &metadata
            .get_transform_plugin_config()
            .unwrap_or_else(|| "{}".to_string()),
    )
    .unwrap_or_else(|_| Config {
        hash_pattern: default_hash_pattern(),
    });

    program.fold_with(&mut as_folder(StyleNameTransformer::new(config)))
}
