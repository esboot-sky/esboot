#!/bin/bash

source_dir="dist/esm"
target_dir="publish"

mkdir $target_dir
cp -R "$source_dir"/* "$target_dir"
cp 'package.json' "${target_dir}/package.json"

echo "All files moved successfully."
