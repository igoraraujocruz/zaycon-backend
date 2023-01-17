import 'dotenv/config'
import axios from 'axios';
import fs from 'fs'
import path from 'path'
import https from 'https'

const cert = fs.readFileSync(
    path.resolve(__dirname, `../certs/${process.env.GN_CERT}`)
  )
  
  const agent = new https.Agent({
    pfx: cert,
    passphrase: ''
  })
  
  const credentials = Buffer.from(
    `${process.env.GN_CLIENT_ID}:${process.env.GN_CLIENT_SECRET}`
  ).toString('base64');

  const authenticate = () => (
    axios({
      method: 'POST',
      url: `${process.env.GN_ENDPOINT}/oauth/token`,
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json'
      },
      httpsAgent: agent,
      data: {
        grant_type: 'client_credentials'
      }
    })
  ) 

  export const gerarPix = async (totalPrice: number, shopId: string) => {
    const authResponse = await authenticate()
    const { access_token } = authResponse.data;   
    
    const reqGN = axios.create({
        baseURL: process.env.GN_ENDPOINT,
        httpsAgent: agent,
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        },
    });

    const dataCob = {   
        calendario: {
            expiracao: 3600
        },
        valor: {
            original: totalPrice.toFixed(2).toString()
        },
        chave: process.env.GN_CHAVE_PIX,
        solicitacaoPagador: shopId
    }

    const cobranca = await reqGN.post('v2/cob', dataCob)

    const qrcode = await reqGN.get(`/v2/loc/${cobranca.data.loc.id}/qrcode`)

    return { qrcode, cobranca }
  }