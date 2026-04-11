use swc_core::ecma::{
    ast::*,
    visit::{VisitMut, VisitMutWith},
};
use swc_core::common::{DUMMY_SP, SyntaxContext};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};
use serde::Deserialize;

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

fn to_camel_case(s: &str) -> String {
    let mut result = String::new();
    let mut next_upper = false;
    for c in s.chars() {
        if c == '-' || c == '_' {
            next_upper = true;
        } else {
            if next_upper {
                result.push(c.to_ascii_uppercase());
                next_upper = false;
            } else {
                result.push(c);
            }
        }
    }
    result
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
    fn generate_scoped_name(&self, class_name: &str, _file_path: &str) -> String {
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
            let src = import_decl.src.value.to_string_lossy().to_string();
            
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
        // DEBUG: Check if we are visiting JSX and if we have imports
        // panic!("DEBUG: Visiting JSX. Imports count: {}", self.style_imports.len());

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
                        let attr_name = &*ident.sym;
                        
                        if attr_name == "styleName" {
                            style_name_index = Some(i);
                            if let Some(val) = &jsx_attr.value {
                            if let Some(val) = &jsx_attr.value {
                                match val {
                                    JSXAttrValue::Str(s) => {
                                        style_name_value = Some(s.value.to_string_lossy().to_string());
                                    }
                                    JSXAttrValue::JSXExprContainer(JSXExprContainer { expr: JSXExpr::Expr(expr), .. }) => {
                                         if let Expr::Lit(Lit::Str(s)) = &**expr {
                                            style_name_value = Some(s.value.to_string_lossy().to_string());
                                        }
                                    }
                                    _ => {}
                                }
                            }
                            }
                        } else if attr_name == "className" {
                            class_name_index = Some(i);
                            if let Some(val) = &jsx_attr.value {
                            if let Some(val) = &jsx_attr.value {
                                match val {
                                    JSXAttrValue::Str(s) => {
                                        class_name_value = Some(s.value.to_string_lossy().to_string());
                                    }
                                     JSXAttrValue::JSXExprContainer(JSXExprContainer { expr: JSXExpr::Expr(expr), .. }) => {
                                        if let Expr::Lit(Lit::Str(s)) = &**expr {
                                            class_name_value = Some(s.value.to_string_lossy().to_string());
                                        }
                                     }
                                     _ => {}
                                }
                            }
                            }
                        }
                    }
                }
            }

            // Transform styleName to className
            if let Some(style_name) = style_name_value {
                // Get the first style import variable
                let style_variable = self.style_imports.iter()
                    .find_map(|import| import.variable.clone());

                if let Some(variable_name) = style_variable {
                     // Generate expressions for each class: variable["class"]
                    let class_exprs: Vec<Expr> = style_name
                        .split_whitespace()
                        .map(|class| {
                            let variable = variable_name.clone();
                            let original_expr = Expr::Member(MemberExpr {
                                span: DUMMY_SP,
                                obj: Box::new(Expr::Ident(Ident::new(variable.clone().into(), DUMMY_SP, SyntaxContext::empty()))),
                                prop: MemberProp::Computed(ComputedPropName {
                                    span: DUMMY_SP,
                                    expr: Box::new(Expr::Lit(Lit::Str(Str {
                                        span: DUMMY_SP,
                                        value: class.into(),
                                        raw: None,
                                    }))),
                                }),
                            });

                            let camel_name = to_camel_case(class);
                            if camel_name != class {
                                let camel_expr = Expr::Member(MemberExpr {
                                    span: DUMMY_SP,
                                    obj: Box::new(Expr::Ident(Ident::new(variable.into(), DUMMY_SP, SyntaxContext::empty()))),
                                    prop: MemberProp::Computed(ComputedPropName {
                                        span: DUMMY_SP,
                                        expr: Box::new(Expr::Lit(Lit::Str(Str {
                                            span: DUMMY_SP,
                                            value: camel_name.into(),
                                            raw: None,
                                        }))),
                                    }),
                                });
                                
                                Expr::Bin(BinExpr {
                                    span: DUMMY_SP,
                                    op: BinaryOp::LogicalOr, // ||
                                    left: Box::new(original_expr),
                                    right: Box::new(camel_expr),
                                })
                            } else {
                                original_expr
                            }
                        })
                        .collect();
                    
                    if !class_exprs.is_empty() {
                        // Create a single expression joining all classes with " "
                        let mut combined_classes_expr = class_exprs[0].clone();
                        for next_expr in class_exprs.iter().skip(1) {
                             combined_classes_expr = Expr::Bin(BinExpr {
                                span: DUMMY_SP,
                                op: BinaryOp::Add,
                                left: Box::new(Expr::Bin(BinExpr {
                                    span: DUMMY_SP,
                                    op: BinaryOp::Add,
                                    left: Box::new(combined_classes_expr),
                                    right: Box::new(Expr::Lit(Lit::Str(Str {
                                        span: DUMMY_SP,
                                        value: " ".into(),
                                        raw: None,
                                    }))),
                                })),
                                right: Box::new(next_expr.clone())
                            });
                        }

                        // Update or add className attribute
                        if let Some(idx) = class_name_index {
                            // Update existing className
                            if let JSXAttrOrSpread::JSXAttr(jsx_attr) = &mut node.opening.attrs[idx] {
                                let final_expr = if let Some(existing) = class_name_value.clone() {
                                    // Case 1: Existing className is a string literal
                                    Expr::Bin(BinExpr {
                                        span: DUMMY_SP,
                                        op: BinaryOp::Add,
                                        left: Box::new(Expr::Lit(Lit::Str(Str {
                                            span: DUMMY_SP,
                                            value: format!("{} ", existing).into(),
                                            raw: None,
                                        }))),
                                        right: Box::new(combined_classes_expr),
                                    })
                                } else {
                                    // Case 2: Existing className is expression
                                    let existing_expr = if let Some(JSXAttrValue::JSXExprContainer(JSXExprContainer { expr: JSXExpr::Expr(expr), .. })) = &jsx_attr.value {
                                        Some(expr.clone())
                                    } else {
                                        None
                                    };
                                    
                                    if let Some(expr) = existing_expr {
                                        Expr::Bin(BinExpr {
                                            span: DUMMY_SP,
                                            op: BinaryOp::Add,
                                            left: expr,
                                            right: Box::new(Expr::Bin(BinExpr {
                                                span: DUMMY_SP,
                                                op: BinaryOp::Add,
                                                left: Box::new(Expr::Lit(Lit::Str(Str {
                                                    span: DUMMY_SP,
                                                    value: " ".into(),
                                                    raw: None,
                                                }))),
                                                right: Box::new(combined_classes_expr),
                                            })),
                                        })
                                    } else {
                                        combined_classes_expr
                                    }
                                };
                                
                                jsx_attr.value = Some(JSXAttrValue::JSXExprContainer(JSXExprContainer {
                                    span: DUMMY_SP,
                                    expr: JSXExpr::Expr(Box::new(final_expr)),
                                }));
                            }
                        } else {
                            // Add new className attribute
                            node.opening.attrs.push(JSXAttrOrSpread::JSXAttr(JSXAttr {
                                span: Default::default(),
                                name: JSXAttrName::Ident(IdentName::new("className".into(), Default::default())),
                                value: Some(JSXAttrValue::JSXExprContainer(JSXExprContainer {
                                    span: Default::default(),
                                    expr: JSXExpr::Expr(Box::new(combined_classes_expr)),
                                })),
                            }));
                        }

                        // Remove styleName attribute
                        if let Some(idx) = style_name_index {
                            node.opening.attrs.remove(idx);
                        }
                    }
                }
            }
        }

        node.visit_mut_children_with(self);
    }
}

#[plugin_transform]
pub fn process_transform(mut program: Program, metadata: TransformPluginProgramMetadata) -> Program {
    let config = serde_json::from_str::<Config>(
        &metadata
            .get_transform_plugin_config()
            .unwrap_or_else(|| "{}".to_string()),
    )
    .unwrap_or_else(|_| Config {
        hash_pattern: default_hash_pattern(),
    });

    let mut transformer = StyleNameTransformer::new(config);
    program.visit_mut_with(&mut transformer);
    program
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn converts_kebab_and_snake_case_to_camel_case() {
        assert_eq!(to_camel_case("text2-cls"), "text2Cls");
        assert_eq!(to_camel_case("text_value"), "textValue");
        assert_eq!(to_camel_case("plain"), "plain");
    }

    #[test]
    fn identifies_local_scss_imports_but_skips_global_styles_directory() {
        let transformer = StyleNameTransformer::new(Config {
            hash_pattern: default_hash_pattern(),
        });

        assert!(transformer.is_style_import("./app.scss"));
        assert!(transformer.is_style_import("../views/home/app.scss"));
        assert!(!transformer.is_style_import("./styles/index.scss"));
        assert!(!transformer.is_style_import("./app.css"));
    }
}
