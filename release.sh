version=$1

python -c "import json; conf = json.load(open('bower.json')); conf['version'] = '$version'; json.dump(conf, open('bower.json', 'w'), indent=2, sort_keys=True, separators=(',', ': '))"

if [ $? ]; then
    git commit bower.json -m $version
    git tag $version
    git push
    git push --tags
else
    echo 'Failed to update bower.json, exiting.'
    exit 1
fi

