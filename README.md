# tymbug

tymbug is a webhook debugging platform that allows developers to capture, replay, compare, and diagnose webhook requests. it helps improve webhook reliability by providing detailed insight into each request.

https://github.com/user-attachments/assets/262466c4-4906-477e-afae-8b7734e413df

## features

- **webhook ingestion:** capture incoming webhooks
- **webhook replay:** resend captured webhooks to their original destination for debugging
- **compare responses:** inspect and compare detailed webhook payloads, headers, and responses

### note

add the required environment variables in `.env` (example file provided in `.env.example`).

### development 

you can fork this repo by clicking the fork button in the top right corner of the page.

#### clone repository:

```bash
git clone https://github.com/<your-username>/tymbug.git
cd tymbug
```

#### install dependencies:

```bash
npm install
```

#### set up environment variables:

copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

update the `.env` file with your configuration.

#### run the development server:

```bash
npm run dev
```

#### build the project for production:

```bash
npm run build
```

#### start the production server:

```bash
npm start
```

## usage example (using tymbug with stripe)

#### Link: [tymbug usage example.pdf](https://github.com/user-attachments/files/18810858/tymbug.usage.example.pdf)

#
*Don't know if this platform has a use case, just wanted to practice async functions and build some stuff* 😄
