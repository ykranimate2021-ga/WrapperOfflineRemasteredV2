const caché = require('../data/caché');
const parse = require('../data/parse');
const fUtil = require('../fileUtil');
const nodezip = require('node-zip');
const fs = require('fs');
var suffix, n;
module.exports = {
	/**
	 *
	 * @param {Buffer} sZip
	 * @returns {Promise<string>}
	 */
	save(sZip, thumb) {
		return new Promise((res) => {
            suffix = fUtil.getNextFileId('str-', '.xml');
			n = fUtil.getNextFileId('str-', '.xml');
			const zip = nodezip.unzip(sZip);
            const thumbFile = fUtil.getFileIndex('sthmb-', '.png', n);
			fs.writeFileSync(thumbFile, thumb);
			let path = fUtil.getFileIndex('str-', '.xml', suffix);
			let writeStream = fs.createWriteStream(path);
            parse.unpackZip(zip, thumb).then(data => {
				writeStream.write(data, () => {
					writeStream.close();
					res('s-' + n);
				});
			});
		});
	},
	thumb(movieId) {
		return new Promise((res, rej) => {
			if (!movieId.startsWith('s-')) return;
			const n = Number.parseInt(movieId.substr(2));
			const fn = fUtil.getFileIndex('sthmb-', '.png', n);
			isNaN(n) ? rej() : res(fs.readFileSync(fn));
		});
	},
	list() {
        var table = [];
        var ids = fUtil.getValidFileIndicies("str-", ".xml");
        for (const i in ids) {
            var id = `s-${ids[i]}`;
            table.unshift({ id: id });
        }
        return table;
	},
}