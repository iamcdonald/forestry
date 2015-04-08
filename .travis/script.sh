#!/bin/bash

echo "//registry.npmjs.org/:_password=${NPM_TOKEN}" > ~/.npmrc
echo "//registry.npmjs.org/:username=iamcdonald" >> ~/.npmrc
echo "//registry.npmjs.org/:email=iain.allan.mcdonald@googlemail.com" >> ~/.npmrc

npm whoami
#if [[ "${TRAVIS_BRANCH}" =~ ^v?[0-9]+\.[0-9]+\.[0-9]+$ ]]
# 	then 
#		source .travis/publish.sh
#	else
#		source .travis/build.sh
#fi
