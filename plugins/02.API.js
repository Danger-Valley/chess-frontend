class Twitter {
  constructor(path) {
    this.localPath = `${path}/twitter`;
  }

  async checkAuth({ authCode, codeChallenge, redirectUri }) {
    return await fetch(`${this.localPath}`, {
      method: "POST",
      body: JSON.stringify({
        authCode,
        codeChallenge,
        redirectUri
      }),
      headers: { 'content-type': 'application/json' }
    });
  }
}
class Discord {
  constructor(path) {
    this.localPath = `${path}/discord`;
  }

  async checkAuth(authCode, redirectUri) {
    return await fetch(`${this.localPath}`, {
      method: "POST",
      body: JSON.stringify({
        authCode,
        redirectUri
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
    blockchain,
    walletAddress,
    signatureType,
    accessToken
  }) {
    return await fetch(`${this.localPath}`, {
      method: "POST",
      body: JSON.stringify({
        blockchain,
        walletAddress,
        signatureType
      }),
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }
}
class User {
  constructor(path, globalPath) {
    this.localPath = `${path}/users`;
    this.path = globalPath;
  }

  async get(accessToken) {
    if (accessToken){
      return await fetch(`${this.localPath}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });        
    }
  }

  async getPaymentProfile(accessToken) {
    if (accessToken){
      return await fetch(`${this.path}/payments/api/v1/users`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
    }
  }

  async chargeHint({ accessToken, id }) {
    return await fetch(`${this.path}/payments/api/v1/users/${id}/chargeHint`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async checkUsername({ accessToken, username }) {
    return await fetch(`${this.localPath}/checkUsername`, {
      method: "POST",
      body: JSON.stringify({ username }),
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  /**
   * to get public user data without accessToken
   * @param {Array} ids - array of ids of wanted users 
   */
  async getByIds(ids) {
    return await fetch(`${this.localPath}/${ids.join(',')}`);
  }

  async update(accessToken, body) {
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
      body: JSON.stringify(body),
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

  async getNFTs({ accessToken, userId }) {
    return await fetch(`${this.localPath}/${userId}/nfts`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

}
class Wallet {
  constructor(path) {
    this.localPath = `${path}/users`;
  }

  async connect({
    blockchain,
    walletAddress,
    signatureId,
    signature,
    signatureType,
    accessToken,
    userId
  }) {
    return await fetch(`${this.localPath}/${userId}/wallets`, {
      method: "POST",
      body: JSON.stringify({
        blockchain,
        walletAddress,
        signatureId,
        signature,
        signatureType
      }),
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async disconnect({
    id,
    accessToken,
    userId
  }) {
    return await fetch(`${this.localPath}/${userId}/wallets/${id}`, {
      method: "DELETE",
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async get({ accessToken, userId }) {
    return await fetch(`${this.localPath}/${userId}/wallets`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async getNFTs({ accessToken, userId, id }) {
    return await fetch(`${this.localPath}/${userId}/wallets/${id}/nfts`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }
}
class Chess {
  constructor(path) {
    this.localPath = `${path}/games`;
    this.path = path;
  }

  async find_create({ mode, color, everyoneCanJoin, isAI, accessToken }) {
    console.log(mode, color)
    return await fetch(`${this.localPath}/init`, {
      method: "POST",
      body: JSON.stringify({
        mode, color,
        everyoneCanJoin,
        isAI
      }),
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async get({ id, accessToken }) {
    return await fetch(`${this.localPath}/${id}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async join({ id, accessToken }) {
    return await fetch(`${this.localPath}/${id}/join`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async move({ id, move, accessToken }) {
    return await fetch(`${this.localPath}/${id}/move`, {
      method: "POST",
      body: JSON.stringify({ move }),
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'content-type': 'application/json'
      }
    });
  }

  async resign({ id, accessToken }) {
    return await fetch(`${this.localPath}/${id}/resign`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async offerDraw({ id, accessToken }) {
    return await fetch(`${this.localPath}/${id}/offer/draw`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async rejectDraw({ id, accessToken }) {
    return await fetch(`${this.localPath}/${id}/offer/draw/reject`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async acceptDraw({ id, accessToken }) {
    return await fetch(`${this.localPath}/${id}/offer/draw/accept`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async offerRevenge({ id, accessToken }) {
    return await fetch(`${this.localPath}/${id}/offer/revenge`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async rejectRevenge({ id, accessToken }) {
    return await fetch(`${this.localPath}/${id}/offer/revenge/reject`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async acceptRevenge({ id, accessToken }) {
    return await fetch(`${this.localPath}/${id}/offer/revenge/accept`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async initEventGame({ id, accessToken }) {
    return await fetch(`${this.path}/events/${id}/games/init`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async getHintForMove({ id, accessToken }) {
    return await fetch(`${this.localPath}/${id}/hint`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }
}
class Lobby {
  constructor(path) {
    this.localPath = `${path}/lobby`;
  }

  async get(accessToken) {
    return await fetch(`${this.localPath}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }
}
class Chat {
  constructor(path) {
    this.localPath = `${path}/chat`;
  }

  async get({ gameId, accessToken }) {
    return await fetch(`${this.localPath}/${gameId}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async send({ text, gameId, accessToken }) {
    return await fetch(`${this.localPath}/${gameId}`, {
      method: "POST",
      body: JSON.stringify({ text }),
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }
}
class Hints {
  constructor(path) {
    this.localPath = `${path}/store/hints`;
  }

  async getPrices(accessToken) {
    return await fetch(`${this.localPath}/prices`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async buy({ accessToken, walletAddress, amount, splTokenId }) {
    return await fetch(`${this.localPath}/purchase`, {
      method: "POST",
      body: JSON.stringify({
        walletAddress,
        amount,
        splTokenId
      }),
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }
    });
  }
}
class Deposit {
  constructor(path) {
    this.localPath = `${path}/deposits`;
  }

  async getStatus({ accessToken, id }) {
    return await fetch(`${this.localPath}/${id}/status`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async claim({ accessToken, id, transaction }) {
    return await fetch(`${this.localPath}/${id}/claim`, {
      method: "POST",
      body: JSON.stringify({ transaction }),
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }
    });
  }
}
class Events {
  constructor(path) {
    this.localPath = `${path}/events`;
  }

  async getArena({ accessToken }) {
    return await fetch(`${this.localPath}/arena`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async getById({ accessToken, id }) {
    return await fetch(`${this.localPath}/${id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async getLeaderboard({ id }) {
    return await fetch(`${this.localPath}/${id}/leaderboard`);
  }

  async register({ accessToken, id, teamId }) {
    return await fetch(`${this.localPath}/${id}/register`, {
      method: "POST",
      body: teamId ? JSON.stringify({ teamId }) : null,
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }
}
class Rewards {
  constructor(path) {
    this.localPath = `${path}/rewards`;
  }

  async get({ accessToken }) {
    return await fetch(`${this.localPath}`, {
      method: "GET",
      headers: {
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
        let path = env.public.API_URL || "https://api-dev.xchess.io";

        return {
          Auth: {
            Discord: new Discord(`${path}/auth/api/v1/auth`),
            Twitter: new Twitter(`${path}/auth/api/v1/auth`),
            Google: new Google(`${path}/auth/api/v1/auth`)
          },
          User: new User(`${path}/auth/api/v1`, path),
          Wallet: new Wallet(`${path}/auth/api/v1`),
          Signatures: new Signatures(`${path}/auth/api/v1`),
          Chess: new Chess(`${path}/game/api/v1`),
          Lobby: new Lobby(`${path}/game/api/v1`),
          Chat: new Chat(`${path}/game/api/v1`),
          Payments: {
            Hints: new Hints(`${path}/payments/api/v1`),
            Deposit: new Deposit(`${path}/payments/api/v1`),
            Rewards: new Rewards(`${path}/payments/api/v1`)
          },
          Events: new Events(`${path}/events/api/v1`)
        }
      }
    }
  }
})