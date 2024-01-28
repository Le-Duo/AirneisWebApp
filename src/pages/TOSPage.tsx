import { Container } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'

const TOSPage = () => {
  return (
    <Container>
      <Helmet>
        <title>Terms of Use</title>
      </Helmet>
      <h1>Terms of Use</h1>
      <p>By using our site, you agree to the following terms of use:</p>
      <ul>
        <li>You must not use our site in an illegal or malicious manner.</li>
        <li>You must not attempt to gain unauthorized access to our site.</li>
        <li>
          You must not use our site to transmit viruses or other malicious
          software.
        </li>
        <li>You must not use our site to harass, insult, or harm others.</li>
      </ul>
    </Container>
  )
}

export default TOSPage
