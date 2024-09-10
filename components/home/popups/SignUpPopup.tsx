import React, { useState, FormEvent, ChangeEvent } from 'react';
import style from './SignUpPopup.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface SignUpPopupProps {
  selectedPackage: string;
  onClose: () => void;
}

const SignUpPopup: React.FC<SignUpPopupProps> = ({ selectedPackage, onClose }) => {
  const [activeTab, setActiveTab] = useState<'subscription'>('subscription');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const handleTabChange = (tab: 'subscription') => {
    setActiveTab(tab);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log({ name, email, phone, password });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className={style.popupContainer}>
      <div className={`${style.popup} ${style.black}`}>
        <div className={style.navTabs}>
          <div>
            <h2 className={`${style.navTab} ${activeTab === 'subscription' ? style.active : ''}`} onClick={() => handleTabChange('subscription')}>Subscription</h2>
          </div>
        </div>
        {activeTab === 'subscription' && (
          <>
            <p>You have selected {selectedPackage} plan, enter your personal information to create your account</p>
            <div>
              <div className={style.searchInput}>
                <form onSubmit={handleSubmit}>
                  <div className={style.row}>
                    <div className={style.frmGrp}>
                      <input type="text" autoComplete="off" placeholder="Name" value={name} onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
                    </div>
                    <div className={style.frmGrp}>
                      <input type="email" autoComplete="off" placeholder="Email address" value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className={style.row}>
                    <div className={style.frmGrp}>
                      <input type="text" autoComplete="off" placeholder="Phone number" value={phone} onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} />
                    </div>
                    <div className={style.frmGrp}>
                      <div className={style.passwordWrapper}>
                        <input type={passwordVisible ? 'text' : 'password'} autoComplete="new-password" placeholder="Password" value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
                        <span className={style.eyeIcon} onClick={togglePasswordVisibility}>
                          {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={style.frmGrp}>
                    <button type="submit" className={style.submit}>[enter]</button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
        <button onClick={onClose} className={style.close}>x</button>
      </div>
    </div>
  );
};

export default SignUpPopup;
