#!/bin/bash
if [[ "${TRAVIS_BRANCH}" =~ ^v?[0-9]+\.[0-9]+\.[0-9]+$ ]]
  	then 
		echo "Publish";	
		export BOWER_V=`sed -n 's/.*"version":.*\([0-9]\{1,\}\.[0-9]\{1,\}\.[0-9]\{1,\}\).*/\1/p' bower.json`;
		export NPM_V=`sed -n 's/.*"version":.*\([0-9]\{1,\}\.[0-9]\{1,\}\.[0-9]\{1,\}\).*/\1/p' package.json`;
		export TAG_V=`echo "${TRAVIS_BRANCH}" | sed -n 's/v\{0,\}\([0-9]\{1,\}\.[0-9]\{1,\}\.[0-9]\{1,\}\)/\1/p'`;
		if [[ ${TAG_V} == ${BOWER_V} && ${TAG_V} == ${NPM_V} ]] 
			then
				echo "Publishing package ${TAG_V}";
				echo "//registry.npmjs.org/:_password=${NPM_TOKEN}" > ~/.npmrc
				echo "//registry.npmjs.org/:email=iain.allan.mcdonald@googlemail.com" >> ~/.npmrc
				npm publish ./
				echo "Success"
			else
				echo "Publishing package ${TAG_V} failed (versions not in alignment)"				
		fi
	else
		echo "Build";
		npm test; 
  		export NAME="Travis-CI"
  		git config --global user.email "--"
  		git config --global user.name $NAME
  		git checkout -b temp;
  		git config remote.origin.fetch +refs/heads/*:refs/remotes/origin/*;
  		git fetch --all;
  		git checkout built;
  		git merge temp -m "Travis - Merging changes";
  		npm run build;
  		git add dist -f;
  		git commit -m "Travis - Committing built assets" --allow-empty;
  		export GIT_REPO_URL=`git config --get remote.origin.url | sed 's#^.*//\(.*\)$#https://'$NAME':'$GH_TOKEN'@\1#'`;
  		git remote set-url origin $GIT_REPO_URL;
  		git push origin built > /dev/null 2>&1;
fi
