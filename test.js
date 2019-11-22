const bcryptjs = require('bcryptjs')
const str = '123'

async function main() {
    const isOk = await bcryptjs.compare(
        '123',

    )
    console.log(isOk)
}
main()