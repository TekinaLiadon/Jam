import node from "../bin/node.js";
async function routerList() {
    const list = {};
    var character = [];
    var gmEntities = []
    var gmItems = []
    var gmPlayer = []
    var player = []
    async function readDirAsync(dir) {
        let files = [];

        const contents = await node.fs.promises.readdir(dir);

        for (const item of contents) {
            const path = `${dir}/${item}`;
            const stat = await node.fs.promises.stat(path);

            if (stat.isFile()) {
                files.push(item);
            } else if (stat.isDirectory()) {
                const subFiles = await readDirAsync(path);
                files = files.concat(subFiles);
            }
        }

        return files;
    }

    await Promise.all([
        readDirAsync(node.path.join(node.alias, '0-entity' , 'character', 'router')),
        readDirAsync(node.path.join(node.alias, '0-entity' , 'gm', 'entities', 'router')),
        readDirAsync(node.path.join(node.alias, '0-entity' , 'gm', 'items', 'router')),
        readDirAsync(node.path.join(node.alias, '0-entity' , 'gm', 'player', 'router')),
        readDirAsync(node.path.join(node.alias, '0-entity' , 'player')),
    ])
        .then(files => {
            character = files[0]
            gmEntities = files[1]
            gmItems = files[2]
            gmPlayer = files[3]
            player = files[4]
        })
        .catch(error => console.error(error));

    for (const name of character) list[name] = await import(`../0-entity/character/router/${name}`);
    for (const name of gmEntities) list[name] = await import(`../0-entity/gm/entities/router/${name}`)
    for (const name of gmItems) list[name] = await import(`../0-entity/gm/items/router/${name}`)
    for (const name of gmPlayer) list[name] = await import(`../0-entity/gm/player/router/${name}`)
    for (const name of player) list[name] = await import(`../0-entity/player/${name}`)

    Object.freeze(list);
    return list
}
export default routerList;