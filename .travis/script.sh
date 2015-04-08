#!/bin/bash
if [[ "${TRAVIS_BRANCH}" =~ ^v?[0-9]+\.[0-9]+\.[0-9]+$ ]]
 	then 
		source .travis/publish.sh
	else
		source .travis/build.sh
fi
