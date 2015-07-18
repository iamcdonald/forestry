#!/bin/bash
echo "Publish";
export BOWER_V=`sed -n 's/.*"version":.*\([0-9]\{1,\}\.[0-9]\{1,\}\.[0-9]\{1,\}\).*/\1/p' bower.json`;
export NPM_V=`sed -n 's/.*"version":.*\([0-9]\{1,\}\.[0-9]\{1,\}\.[0-9]\{1,\}\).*/\1/p' package.json`;
export TAG_V=`echo "${TRAVIS_BRANCH}" | sed -n 's/v\{0,\}\([0-9]\{1,\}\.[0-9]\{1,\}\.[0-9]\{1,\}\)/\1/p'`;
if [[ ${TAG_V} == ${BOWER_V} && ${TAG_V} == ${NPM_V} ]]
	then
		echo "Publishing package ${TAG_V}";
		echo "//registry.npmjs.org/:_password=${NPM_TOKEN}" > ~/.npmrc
		echo "//registry.npmjs.org/:username=iamcdonald" >> ~/.npmrc
		echo "//registry.npmjs.org/:email=iain.allan.mcdonald@googlemail.com" >> ~/.npmrc
		npm publish ./
		echo "Success"
	else
		echo "Publishing package ${TAG_V} failed (versions not in alignment)"
		exit 1				
fi
