let signer;
const tokenAddress = "0xYourTokenAddress"; // Замените на адрес токена ERC-20 (например, USDT)
const spenderAddress = "0xYourSpenderAddress"; // Замените на адрес контракта, которому разрешаем использовать токены
const amount = ethers.utils.parseUnits('100', 6); // Разрешить использовать 100 токенов (для USDT обычно 6 знаков после запятой)

const status = msg => { document.getElementById('status').textContent = msg; };

document.getElementById('connectBtn').onclick = async () => {
  if (!window.ethereum) return status("MetaMask не установлен!");

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    document.getElementById('approveBtn').style.display = '';
    document.getElementById('txBtn').style.display = '';
    status("MetaMask подключен!");
  } catch (err) {
    status("Ошибка подключения: " + err.message);
  }
};

document.getElementById('approveBtn').onclick = async () => {
  if (!signer) return status("Сначала подключите MetaMask!");
  try {
    const token = new ethers.Contract(tokenAddress, [
      "function approve(address spender, uint256 amount) external returns (bool)"
    ], signer);
    const tx = await token.approve(spenderAddress, amount);
    status('Ожидание подтверждения approve...');
    await tx.wait();
    status('Approve успешно выполнен! Tx hash: ' + tx.hash);
  } catch (err) {
    status('Ошибка approve: ' + err.message);
  }
};

document.getElementById('txBtn').onclick = async () => {
  if (!signer) return status("Сначала подключите MetaMask!");
  try {
    const tx = await signer.sendTransaction({
      to: '0x0123456789abcdef0123456789abcdef01234567', // Замените на адрес реального получателя
      value: ethers.utils.parseEther('0.01')
    });
    status('Ожидание подтверждения отправки ETH...');
    await tx.wait();
    status('ETH отправлен, hash: ' + tx.hash);
  } catch (err) {
    status('Ошибка отправки ETH: ' + err.message);
  }
};
