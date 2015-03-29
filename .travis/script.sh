#!/bin/bash
if [[ "${TRAVIS_BRANCH}" =~ ^v?[0-9]+\.[0-9]+\.[0-9]+$ ]]
  	then 
		source .travis/publish.sh
	else
		if [[ "${TRAVIS_BRANCH}" == "master" ]]
			then
				source .travis/build.sh
			else
				source .travis/build-site.sh
		fi
fi
