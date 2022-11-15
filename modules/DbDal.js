import pg from 'pg'

const client = new pg.Client({
    user: 'postgres',
    host: 'db',
    database: 'question_two',
    password: 'postgres',
    port: 5432,
})
client.connect()


async function executeInsertQuery(text, values) {
    try {
        const res = await client.query(text, values)
        return res.rowCount
    } catch (err) {
        console.log(err.stack)
    }
}

async function saveDuplicatedFile(node, text) {
    const howManyItems = "select count(*) from files_storage where file_name ilike $1";
    try {
        const res = await client.query(howManyItems, [node['file_name'] + "%"]);
        var { count } = res.rows[0];
        count = parseInt(count) + 1
        const values = [node['url'], node['file_name'] + "-" + count, node['binary_data'].toString('base64')];
        await executeInsertQuery(text, values);
    } catch (err) {
        console.log(err.stack);
    }
}

export const saveFile = async (data) => {
    await data.map(async (node) => {
        const sql = "\
      INSERT INTO files_storage (url,file_name,bytes)\
        VALUES ($1,$2,$3) on conflict do nothing"

        const values = [node['url'], node['file_name'], node['binary_data'].toString('base64')]
        const success = 1 == await executeInsertQuery(sql, values)
        if (!success) {
            await saveDuplicatedFile(node, sql);
        }
    })
}
