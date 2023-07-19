#!/bin/bash

# Retrieve branch name
echo "branch": $(git branch --show-current)

if [[ "$branch" == "main" || "$branch" == "develop" ]]; then
  # Proceed with build
    exit 1;
else
  # Don't build
  exit 0;
fi