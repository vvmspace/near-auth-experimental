import { connect, keyStores, WalletConnection } from 'near-api-js';
import { Buffer } from 'buffer';
window.Buffer = Buffer;

const config = {
  networkId: 'mainnet',
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: 'https://rpc.mainnet.near.org',
  walletUrl: 'https://app.mynearwallet.com',  // <-- Исправлено здесь!
};


async function init() {
  const near = await connect(config);
  const wallet = new WalletConnection(near, 'my_near_app');

  const loginBtn = document.getElementById('login');
  const signBtn = document.getElementById('sign');
  const logoutBtn = document.getElementById('logout');

  if (!wallet.isSignedIn()) {
    loginBtn.onclick = () => wallet.requestSignIn({
      // укажи здесь contractId, если есть, иначе можно оставить пустым
      successUrl: window.location.href,  
      failureUrl: window.location.href,
    });
    signBtn.disabled = true;
    if (logoutBtn) logoutBtn.style.display = 'none';
  } else {
    loginBtn.textContent = `Logged in as ${wallet.getAccountId()}`;
    loginBtn.disabled = true;
    signBtn.disabled = false;
    if (logoutBtn) {
      logoutBtn.style.display = 'block';
      logoutBtn.onclick = () => {
        wallet.signOut();
        window.location.reload();
      };
    }
  }

  signBtn.onclick = async () => {
    const accountId = wallet.getAccountId();
    const keyPair = await config.keyStore.getKey(config.networkId, accountId);

    const message = 'nonce-123';
    const messageBytes = new TextEncoder().encode(message);
    const signature = keyPair.sign(messageBytes).signature;

    fetch('http://localhost:3000/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        publicKey: keyPair.getPublicKey().toString(),
        signature: Buffer.from(signature).toString('base64')
      })
    })
    .then(res => res.json())
    .then(console.log)
    .catch(console.error);
  };
}

init();
