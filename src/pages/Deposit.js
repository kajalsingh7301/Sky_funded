import React, { useState } from 'react';
import './Deposit.css';
import btc from '../Assets/btc.jpg';
import eth from '../Assets/eth.jpg';
import usdt from '../Assets/usdt.jpeg';

const paymentData = {
  usdt: {
    label: 'USDT (TRC20)',
    walletAddress: 'T1234abcd5678efgh9012ijkl3456mnop',
    network: 'TRC20',
    icon: usdt,
    description: 'Fast & low fee TRC20 network.',
  },
  eth: {
    label: 'Ethereum (ERC20)',
    walletAddress: '0x123456789abcdef123456789abcdef123456789a',
    network: 'ERC20',
    icon: eth,
    description: 'Popular ERC20 token on Ethereum network.',
  },
  btc: {
    label: 'Bitcoin',
    walletAddress: 'bc1qq7hdg2rjgpm9u8l0y4xnwhzt8sr3480njea5',
    network: 'Bitcoin',
    icon: btc,
    description: 'Original Bitcoin network payment.',
  },
};

const Deposit = () => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [amountError, setAmountError] = useState('');
  const [showCongrats, setShowCongrats] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');

  const resetForm = () => {
    setAmount('');
    setSelectedMethod('');
    setScreenshot(null);
    setScreenshotFile(null);
    setSaveMessage('');
    setAmountError('');
    setCopyMessage('');
  };

  const handlePaymentClick = (method) => {
    setSelectedMethod(method);
    setScreenshot(null);
    setScreenshotFile(null);
    setSaveMessage('');
    setShowCongrats(false);
    setCopyMessage('');
  };

  const handleBack = () => {
    resetForm();
    setShowCongrats(false);
  };

  const handleScreenshotChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshot(URL.createObjectURL(file));
      setScreenshotFile(file);
      setSaveMessage('');
      setShowCongrats(false);
    }
  };

  const handleAmountChange = (e) => {
    const val = e.target.value;
    setAmount(val);
    const numVal = parseFloat(val);
    if (val !== '' && (isNaN(numVal) || numVal < 10)) {
      setAmountError('Minimum deposit amount is $10');
    } else {
      setAmountError('');
    }
    setShowCongrats(false);
  };

  const copyWalletAddress = () => {
    if (selectedMethod) {
      navigator.clipboard
        .writeText(paymentData[selectedMethod].walletAddress)
        .then(() => {
          setCopyMessage('Wallet address copied!');
          setTimeout(() => setCopyMessage(''), 3000);
        })
        .catch(() => {
          setCopyMessage('Failed to copy wallet address.');
          setTimeout(() => setCopyMessage(''), 3000);
        });
    }
  };

  const handleSaveScreenshot = async () => {
    if (!screenshotFile) {
      setSaveMessage('Please select a screenshot to upload.');
      return;
    }
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) < 10) {
      setSaveMessage('Please enter a valid amount (minimum $10).');
      return;
    }
    if (!selectedMethod) {
      setSaveMessage('Please select a payment method.');
      return;
    }

    setSaving(true);
    setSaveMessage('');
    setShowCongrats(false);

    try {
      const formData = new FormData();
      formData.append('screenshot', screenshotFile);
      formData.append('amount', amount);
      formData.append('paymentMethod', selectedMethod);

      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/deposit/save', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        await response.json();
        setShowCongrats(true);
        setSaveMessage('');

        // Delay reset to allow success message to be visible
        setTimeout(() => {
          setShowCongrats(false);
          resetForm();
        }, 4000);
      } else {
        const errData = await response.json();
        setSaveMessage(errData.msg || 'Failed to save deposit information. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setSaveMessage('Error saving deposit information.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(''), 4000);
    }
  };

  const isSaveDisabled =
    saving ||
    amountError !== '' ||
    !screenshotFile ||
    !selectedMethod ||
    !amount ||
    isNaN(parseFloat(amount)) ||
    parseFloat(amount) < 10;

  return (
    <div className="deposit-container">
      <div className="deposit-left-panel">
        <h1>Fund your Account Balance</h1>

        {!selectedMethod ? (
          <>
            <label htmlFor="amount">Enter Amount</label>
            <input
              id="amount"
              type="number"
              placeholder="Enter Amount"
              value={amount}
              onChange={handleAmountChange}
              min="10"
              step="any"
            />
            {amountError && <p className="error-message">{amountError}</p>}

            <label>Select Payment Method</label>
            <div className="payment-method-list">
              {Object.entries(paymentData).map(([key, data]) => (
                <div
                  key={key}
                  className={`payment-method-item ${selectedMethod === key ? 'active' : ''}`}
                  onClick={() => handlePaymentClick(key)}
                  title={data.description}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handlePaymentClick(key);
                  }}
                >
                  <img src={data.icon} alt={data.label} />
                  <span>{data.label}</span>
                  <input type="radio" name="payment" checked={selectedMethod === key} readOnly />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2>Deposit via {paymentData[selectedMethod].label}</h2>
            <p>Amount to deposit: <strong>${amount || 'N/A'}</strong></p>

            <p><strong>Wallet Address:</strong></p>
            <div className="wallet-address-box">
              <span>{paymentData[selectedMethod].walletAddress}</span>
              <button type="button" className="copy-btn" onClick={copyWalletAddress}>
                Copy
              </button>
            </div>
            {copyMessage && <p className="copy-message">{copyMessage}</p>}

            <p>Network: {paymentData[selectedMethod].network}</p>

            <div className="qr-preview">
              <h4>Scan QR to Pay:</h4>
              <img
                src={paymentData[selectedMethod].icon}
                alt={`${paymentData[selectedMethod].label} QR`}
                className="qr-image"
              />
            </div>

            <div className="upload-section" style={{ marginTop: '30px' }}>
              <label htmlFor="screenshot-upload" className="upload-label">
                Upload Payment Screenshot:
              </label>
              <input
                type="file"
                id="screenshot-upload"
                accept="image/*"
                onChange={handleScreenshotChange}
              />

              {screenshot && (
                <div className="screenshot-preview">
                  <img src={screenshot} alt="Uploaded screenshot" />
                </div>
              )}
            </div>

            {saveMessage && <p className="save-message">{saveMessage}</p>}

            {showCongrats && (
              <p className="congrats-message">
                Deposit screenshot saved successfully! Thank you!
              </p>
            )}

            <div className="buttons-container" style={{ marginTop: '20px' }}>
              <button type="button" className="back-btn" onClick={handleBack} disabled={saving}>
                Back
              </button>
              <button
                type="button"
                className="save-btn"
                onClick={handleSaveScreenshot}
                disabled={isSaveDisabled}
              >
                {saving ? 'Saving...' : 'Save Screenshot'}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="deposit-right-panel">
        <h2>Note:</h2>
        <ul>
          <li>Minimum deposit amount is $10.</li>
          <li>Payment must be made exactly as per instructions.</li>
          <li>Keep your payment receipt or screenshot for verification.</li>
          <li>Funds will be credited after verification.</li>
        </ul>
      </div>
    </div>
  );
};

export default Deposit;

