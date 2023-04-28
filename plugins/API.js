class Auth {
  constructor(path) {
    this.localPath = `${path}/auth`;
  }

  async auth({
    walletAddress,
    blockchain = "SOLANA",
    signatureId,
    signature
  }) {
    let referralCode = localStorage.getItem("REF_KEY")
    return await fetch(`${this.localPath}`, {
      method: "POST",
      body: JSON.stringify({
        signatureId,
        signature,
        walletAddress,
        blockchain,
        referralCode
      }),
      headers: { 'content-type': 'application/json' }
    });
  }
}
class Twitter {
  constructor(path) {
    this.localPath = `${path}/twitter`;
  }

  async checkAuth({ authCode, codeChallenge }) {
    return await fetch(`${this.localPath}`, {
      method: "POST",
      body: JSON.stringify({
        authCode,
        codeChallenge
      }),
      headers: { 'content-type': 'application/json' }
    });
  }
}
class Discord {
  constructor(path) {
    this.localPath = `${path}/discord`;
  }

  async checkAuth(authCode) {
    return await fetch(`${this.localPath}`, {
      method: "POST",
      body: JSON.stringify({
        authCode
      }),
      headers: { 'content-type': 'application/json' }
    });
  }
}
class Google {
  constructor(path) {
    this.localPath = `${path}/google`;
  }

  async checkAuth(token) {
    return await fetch(`${this.localPath}`, {
      method: "POST",
      body: JSON.stringify({
        token
      }),
      headers: { 'content-type': 'application/json' }
    });
  }
}
class Signatures {
  constructor(path) {
    this.localPath = `${path}/signatures`;
  }

  async create({
    blockchain = 'SOLANA',
    walletAddress,
    signatureType
  }) {
    return await fetch(`${this.localPath}`, {
      method: "POST",
      body: JSON.stringify({
        blockchain,
        walletAddress,
        signatureType
      }),
      headers: { 'content-type': 'application/json' }
    });
  }
}
class User {
  constructor(path) {
    this.localPath = `${path}/users`;
  }

  async get(accessToken) {
    return await fetch(`${this.localPath}`, {
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async update(accessToken, body) {
    console.log(accessToken, body, {
      method: "POST",
      body: body,
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }})
    return await fetch(`${this.localPath}`, {
      method: "POST",
      /**
       * body: {
          username,
          avatar,
          twitter: {
            twitterAuthCode, codeChallenge
          },
          discord: {
            discordAuthCode
          },
          google: {
            token
          }
        },
       */
      body: body,
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async delete(accessToken) {
    return await fetch(`${this.localPath}`, {
      method: "DELETE",
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      API() {
        let env = useRuntimeConfig();
        let path = env.public.API_URL || "https://api-dev.thechess.io/auth";

        return {
          Auth: {
            Discord: new Discord(`${path}/auth/api/v1/auth`),
            Twitter: new Twitter(`${path}/auth/api/v1/auth`),
            Google: new Google(`${path}/auth/api/v1/auth`)
          },
          User: new User(`${path}/auth/api/v1`)
        }
      }
    }
  }
})