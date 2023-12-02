import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import { Ai } from '@cloudflare/ai'

const app = new Hono().basePath('/api')

app.post('/text-generation', async (c) => {
  const messages = await c.req.json()
  const ai = new Ai(c.env.AI);
  const response = await ai.run('@cf/meta/llama-2-7b-chat-int8', { messages });
  return c.json(response)
})


app.post('/text-to-image', async (c) => {
  const inputs = await c.req.json()
  const ai = new Ai(c.env.AI);
  const response = await ai.run("@cf/stabilityai/stable-diffusion-xl-base-1.0", inputs);
  c.header('Content-Type', 'image/png')
  return c.body(response)
})


app.post('/translation', async (c) => {
  const inputs = await c.req.json()
  console.log(inputs)
  const ai = new Ai(c.env.AI);
  const response = await ai.run('@cf/meta/m2m100-1.2b', inputs);
  return c.json(response)
})

export const onRequest = handle(app)
