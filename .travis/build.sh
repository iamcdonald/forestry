#!/bin/bash
echo "Build";
npm test || exit 1;
npm run coverage
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
