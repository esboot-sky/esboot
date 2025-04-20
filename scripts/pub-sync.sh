#! /bin/bash

echo "Start Publishing Packages"
echo "========================="

cd "$(dirname "$0")/../packages" || exit 1

for dir in */
do
  if [ -d "$dir" ]; then
    cd "${dir%/}" || exit 1
    echo "publishing $dir"
    echo "========================="

    if ! pnpm publish --access public --no-git-checks; then
      echo "Failed to publish $dir"
      echo "========================="
    fi

    cd - || exit 1
  fi
done

echo "========================="
echo "Done Publishing Packages"
