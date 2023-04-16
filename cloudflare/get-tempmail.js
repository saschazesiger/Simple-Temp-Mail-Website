import { connect } from '@planetscale/database'

const config = {
  host: 'aws.connect.psdb.cloud',
  username: '51kbeuzgqvjtu6i9fux7',
  password: 'pscale_pw_3YhwzLxG6WFGoBukwZNraK0Vun2JskOBRIJtdIFk81T',
  fetch: (url, init) => {
    delete (init)["cache"]; // Remove cache header
    return fetch(url, init);
  }
}

export default {
  async fetch(request, env) {
    const params = (request.url).split("?")[1]
    let result
    let response
    const conn = connect(config)
    if (params.includes('&')){
      const mail = params.split("&")[0]
      const id = params.split("&")[1]
      console.log(mail,id)
      result = await conn.execute(`SELECT body FROM mail WHERE receiver = "${mail}" AND id = "${id}" LIMIT 1`)
      response = new Response(result.rows[0].body);
    } else {
      result = await conn.execute(`SELECT id,receiver,date,info FROM mail WHERE receiver = "${params}" ORDER BY date ASC LIMIT 20`)
      let json = {}
      for (let r in result.rows){
        json[result.rows[r].id] = {"randomid": result.rows[r].id,"to": result.rows[r].receiver, "date": result.rows[r].date, "from": JSON.parse(result.rows[r].info).from, "from_mail": JSON.parse(result.rows[r].info).from_mail, "messageId": JSON.parse(result.rows[r].info).messageId, "subject": JSON.parse(result.rows[r].info).subject}
      }
      response = new Response(JSON.stringify(json));
    }
		console.log(result)
    
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
      return response
  }
}

