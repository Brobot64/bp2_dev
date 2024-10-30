'use client';
import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import style from './SignInPopup.module.css';
import axios, { AxiosError } from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthProvider';
import { useRouter } from 'next/navigation';
import { RiCloseCircleLine } from 'react-icons/ri';
import { AiOutlineClose } from 'react-icons/ai';

interface SignInPopupProps {
  onClose: () => void;
  onSignInSuccess: (token: string) => void;
  onEditProfile: boolean;
  onLoggedOut: () => void;
  showCloseButton?: boolean;
}

type Feature = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};


interface SignUpErrorResponse {
  errors: { [key: string]: string[] };
}

interface LoginErrorResponse {
  error: string;
}

const SignInPopup: React.FC<SignInPopupProps> = ({
  onClose,
  onSignInSuccess,
  onEditProfile,
  onLoggedOut,
  showCloseButton = true,
}) => {
  const { setToken, token, logout, loggedUser, hasPackage, setHasPackage } =
    useAuth();

  const [activeTab, setActiveTab] = useState<'signin' | 'subscribe' | 'forget'>(
    'signin'
  );
  const [activeProfileTab, setActiveProfileTab] = useState<
    'account' | 'subscription' | 'subscribe'
  >('account');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<JSX.Element | string>(
    '[ enter ]'
  );
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [selectedPackageName, setSelectedPackageName] = useState<string | null>(
    null
  );
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [registrationSuccess, setRegistrationSuccess] =
    useState<boolean>(false);
  const [animationClass, setAnimationClass] = useState<string>('');
  const [counter, setCounter] = useState<number>(7);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [editable, setEditable] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>('');
  const router = useRouter();
  const [demFeatures, setDemFeatures] = useState<Feature[]>([]);
  const [authUser, setAuthUser] = useState<boolean>(false);
  const [packages, setPackages] = useState<any[]>([]);
  const [showPackageSelection, setShowPackageSelection] =
    useState<boolean>(false);

  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('Bitcoin');

  const paymentTypes = ['Bitcoin', 'Credit Card', 'PayPal', 'Bank Transfer'];

  const handlePaymentChange = (payment: any) => {
    setSelectedPayment(payment);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const handleDashboardNavigation = () => {
    router.push('/dashboard');
  };

  const handleChangeClick = () => {
    setSelectedPackage(null);
    setSelectedPackageName(null);
    setActiveProfileTab('subscribe');
  };

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const [featuresResponse, packagesResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/features`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/packages`),
        ]);

        setDemFeatures(featuresResponse.data.data || []); // Ensure it’s an array
        setPackages(packagesResponse.data || []);
      } catch (error) {
        console.error('Failed to fetch packages', error);
      }
    };

    fetchPackages();
  }, []);

  function getFeatureNameById(id: string | number): string | null {
    const feature = demFeatures.find((item) => item.id === parseInt(id as string, 10));
    return feature ? feature.name : null;
  }

  useEffect(() => {
    if (loggedUser?.role_id == 1 || loggedUser?.role_id == 2) {
      setAuthUser(true);
    }
  }, [authUser, router]);

  useEffect(() => {
    if (registrationSuccess) {
      const timer = setInterval(() => {
        setCounter((prevCounter) => {
          if (prevCounter === 1) {
            clearInterval(timer);
            window.location.href = '/';
          }
          return prevCounter - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [registrationSuccess]);

  useEffect(() => {
    if (onEditProfile) {
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/user`,
              {
                headers: { Authorization: token },
              }
            );
            const userData = response.data;
            setName(userData.user.name);
            setEmail(userData.user.email);
            setPhone(userData.user.phone);
            setUserRole(userData.user.role);
          }
        } catch (error) {
          console.error('Failed to fetch user data', error);
        }
      };
      fetchUserData();
    }
  }, [onEditProfile]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setButtonText(<div className={style.spinner}></div>);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
        {
          email,
          password,
        }
      );
      console.log('Login successful', response.data);
      setLoading(false);
      setSuccess(true);
      setButtonText('✔');
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      onSignInSuccess(token);
    } catch (error) {
      console.error('Login failed', error);
      const axiosError = error as AxiosError<LoginErrorResponse>;
      if (
        axiosError.response &&
        axiosError.response.data &&
        axiosError.response.data.error
      ) {
        if (axiosError.response.status === 401) {
          setErrors({ error: ['Don\'t have an account yet?'] });
        } else if (axiosError.response.status === 403) {
          setErrors({
            error: ['Account not activated. Please check your email.'],
          });
        } else {
          setErrors({ error: [axiosError.response.data.error] });
        }
      } else {
        setErrors({
          error: ['An unexpected error occurred. Please try again.'],
        });
      }
      setLoading(false);
      setButtonText('[ enter ]');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setButtonText(<div className={style.spinner}></div>);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/forgot-password`,
        {
          email,
        }
      );
      console.log('Password reset link sent', response.data);
      setLoading(false);
      setSuccess(true);
      // setButtonText('✔');
      setButtonText('Check your email and click on the password reset link')
    } catch (error) {
      console.error('Password reset failed', error);
      const axiosError = error as AxiosError<{ error: string }>;
      if (
        axiosError.response &&
        axiosError.response.data &&
        axiosError.response.data.error
      ) {
        setErrors({ error: [axiosError.response.data.error] });
      } else {
        setErrors({
          error: ['An unexpected error occurred. Please try again.'],
        });
      }
      setLoading(false);
      setButtonText('Reset Password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setButtonText(<div className={style.spinner}></div>);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/register`,
        {
          name,
          email,
          password,
          password_confirmation: confirmPassword,
          selectedPackage,
          selectedPackageName,
        }
      );

      console.log('SignUp successful', response.data);
      setLoading(false);
      setSuccess(true);
      setButtonText('✔');

      setTimeout(() => {
        setRegistrationSuccess(true);
        setAnimationClass(style.fadeIn);
      }, 2000);
    } catch (error) {
      console.error('SignUp failed', error);
      const axiosError = error as AxiosError<SignUpErrorResponse>;
      if (
        axiosError.response &&
        axiosError.response.data &&
        axiosError.response.data.errors
      ) {
        setErrors(axiosError.response.data.errors);
      } else {
        console.error('SignUp failed', error);
      }
      setLoading(false);
      setButtonText('[ enter ]');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setButtonText(<div className={style.spinner}></div>);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userDataToUpdate: any = { name };
        if (password !== '') {
          userDataToUpdate.password = password;
        }
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user`,
          userDataToUpdate,
          {
            headers: { Authorization: `${token}` },
          }
        );
        console.log('Profile updated', response.data);
        const { user } = response.data;
        localStorage.setItem('user', JSON.stringify(response.data));
        onSignInSuccess(user);
        setButtonText('✔');
      }
    } catch (error) {
      console.error('Failed to update profile', error);
      const axiosError = error as AxiosError<SignUpErrorResponse>;
      if (
        axiosError.response &&
        axiosError.response.data &&
        axiosError.response.data.errors
      ) {
        setErrors(axiosError.response.data.errors);
      } else {
        setErrors({
          error: ['An unexpected error occurred. Please try again.'],
        });
      }
      setButtonText('[ enter ]');
    } finally {
      setLoading(false);
      setTimeout(() => setButtonText('[ enter ]'), 2000);
    }
  };

  const handleTabChange = (tab: 'signin' | 'subscribe' | 'forget') => {
    setAnimationClass(style.fadeOut);
    setTimeout(() => {
      setActiveTab(tab);
      setAnimationClass(style.fadeIn);
    }, 500);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  const handlePackageSelect = (pkgID: number, pkgName: string) => {
    setSelectedPackage(pkgID);
    setSelectedPackageName(pkgName);
  };

  const handlePackageUpdate = async (pkgID: number, pkgName: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/update-package`,
        { selectedPackage: pkgID, selectedPackageName: pkgName },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      console.log('Package updated successfully:', response.data);
      setHasPackage(pkgName);
      setActiveProfileTab('subscription');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error updating package:', error.response?.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handleEditClick = () => {
    setEditable(true);
  };

  return (
    <div className={style.popupContainer}>
      <div className={`${style.popup} ${style.black}`}>
        <div className={style.content}>
          {!registrationSuccess && !onEditProfile && (
            <>
              {!selectedPackage && (
                <div className={style.navTabs}>
                  <div>
                    <h2
                      className={`${style.navTab} ${
                        activeTab === 'signin' ? style.active : ''
                      }`}
                      onClick={() => handleTabChange('signin')}
                    >
                      Sign In
                    </h2>
                  </div>
                  <div>
                    <h2
                      className={`${style.navTab} ${
                        activeTab === 'subscribe' ? style.active : ''
                      }`}
                      onClick={() => handleTabChange('subscribe')}
                    >
                      Subscribe
                    </h2>
                  </div>
                </div>
              )}

              {activeTab === 'subscribe' && selectedPackage && (
                <>
                  <button
                    onClick={() => {
                      setSelectedPackage(null);
                      setSelectedPackageName(null);
                    }}
                    className={style.backButton}
                  >
                    ←
                  </button>

                  <div className={style.navTabs}>
                    <div>
                      <h2 className={`${style.navTab} ${style.other}`}>
                        Subscription
                      </h2>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {onEditProfile ? (
            <>
              {activeProfileTab === 'account' && (
                <div className={style.searchInput}>
                  <form onSubmit={handleUpdateProfile}>
                    <h2>Hello, [{name}]</h2>
                    <div className={style.frmGrp}>
                      <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setName(e.target.value)
                        }
                        disabled={!editable}
                      />
                      {errors.name && (
                        <span className={style.error}>{errors.name[0]}</span>
                      )}
                    </div>
                    <div className={style.frmGrp}>
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setEmail(e.target.value)
                        }
                        disabled
                      />
                      {errors.email && (
                        <span className={style.error}>{errors.email[0]}</span>
                      )}
                    </div>
                    <div className={style.frmGrp}>
                      <div className={style.passwordWrapper}>
                        <input
                          type={passwordVisible ? 'text' : 'password'}
                          placeholder="Password"
                          value={password}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setPassword(e.target.value)
                          }
                          disabled={!editable}
                        />
                        <span
                          className={style.eyeIcon}
                          onClick={togglePasswordVisibility}
                        >
                          {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                      {errors.password && (
                        <span className={style.error}>
                          {errors.password[0]}
                        </span>
                      )}
                    </div>
                    <div className={` ${style.buttonWrapper}`}>
                      <button
                        type="button"
                        className={style.submit}
                        onClick={handleEditClick}
                      >
                        [edit]
                      </button>
                      <button
                        type="button"
                        className={style.submit}
                        onClick={handleUpdateProfile}
                      >
                        [save]
                      </button>
                    </div>
                  </form>
                </div>
              )}
              {activeProfileTab === 'subscription' && (
                <div className={style.searchInput}>
                  <form onSubmit={handleUpdateProfile}>
                    <h2>Hello, [{name}]</h2>
                    <div className={`${style.subscription} ${style.frmGrp}`}>
                      <div className={` ${style.muted} `}>
                        Your Current plan is:{' '}
                      </div>
                      <div className={` ${style.cPlan} `}>
                        {hasPackage || 'No Package Selected'}
                      </div>
                      <div className={` ${style.action} `}>
                        {hasPackage ? (
                          <button onClick={handleChangeClick}>[Change]</button>
                        ) : (
                          <button onClick={handleChangeClick}>[Select]</button>
                        )}
                      </div>
                    </div>
                    <div className={`${style.subscription} ${style.frmGrp}`}>
                      <div className={` ${style.muted}`}>
                        Method of payment:{' '}
                      </div>
                      <div className={` ${style.cPlan}`}>
                        {selectedPayment}
                      </div>
                      <div className={` ${style.action} cursor-pointer`} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        [Change]
                      </div>
                      {isDropdownOpen && (
                        <div className={style.dropdown}>
                          {paymentTypes.map((payment, index) => (
                            <div key={index} className={style.dropdownItem} onClick={() => handlePaymentChange(payment)}>
                              {payment}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div
                      className={`${style.subscription} ${style.buttonWrapper}`}
                    >
                      <button
                        type="button"
                        className={style.submit}
                        onClick={handleUpdateProfile}
                      >
                        [save]
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeProfileTab === 'subscribe' && !selectedPackage && (
                <>
                  <p>Select a package to subscribe</p>
                  <div className={style.packages}>
                    {packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={style.package}
                        onClick={() => handlePackageUpdate(pkg.id, pkg.name)}
                      >
                        <span>{pkg.name}</span>
                        <span>
                          {pkg.price}
                          <sub>£</sub>
                        </span>
                        <span>
                          <ul>
                            {pkg.features.map((featureId: any, index: number) => (
                              <li key={index}>{getFeatureNameById(featureId) || 'Unknown Feature'}</li>
                            ))}
                          </ul>
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div></div>
          )}

          {!registrationSuccess && !onEditProfile && (
            <div className={`${animationClass} ${style.tabContent}`}>
              {activeTab === 'signin' && !showForgotPassword && (
                <>
                  <p>Enter your credentials to access your account</p>
                  <div className={style.searchInput}>
                    <form onSubmit={handleLogin}>
                      <div className={style.frmGrp}>
                        <input
                          type="email"
                          autoComplete="off"
                          placeholder="Email"
                          value={email}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setEmail(e.target.value)
                          }
                        />
                        {errors.email && (
                          <span className={style.error}>{errors.email[0]}</span>
                        )}
                      </div>
                      <div className={style.frmGrp}>
                        <div className={style.passwordWrapper}>
                          <input
                            type={passwordVisible ? 'text' : 'password'}
                            autoComplete="new-password"
                            placeholder="Password"
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setPassword(e.target.value)
                            }
                          />
                          <span
                            className={style.eyeIcon}
                            onClick={togglePasswordVisibility}
                          >
                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                          </span>
                        </div>
                        {errors.password && (
                          <span className={style.error}>
                            {errors.password[0]}
                          </span>
                        )}
                      </div>
                      <div className={style.frmGrp}>
                        <button type="submit" className={style.submit}>
                          {buttonText}
                        </button>
                      </div>
                      <div
                        className={`${style.errorAll} ${Object.keys(errors).length > 0 ? 'show' : ''}`}
                      >
                        {Object.keys(errors).map((key) =>
                          errors[key].map((error, index) => (
                            <p key={`${key}-${index}`}>
                              {error}{' '}
                              <a
                                href="#"
                                style={{ textDecoration: 'underline' }}
                                onClick={() => handleTabChange('subscribe')}
                              >
                                Click here
                              </a>
                               &nbsp;to Subscribe to the BLVCKBOOK <br/><br/>
                               <a
                                href="#"
                                style={{ textDecoration: 'underline' }}
                                onClick={() => handleTabChange('forget')}
                              >
                                Forget Password?
                              </a>
                            </p>
                          ))
                        )}
                          {/* <a
                            href="#"
                            style={{ textDecoration: 'underline' }}
                            onClick={() => handleTabChange('forget')}
                          >
                            Forget Password
                          </a> */}
                      </div>
                    </form>
                  </div>
                </>
              )}

              {activeTab === 'forget' && !showForgotPassword && (
                <>
                  <button
                    onClick={() => handleTabChange('signin')}
                    className={style.backButton}
                  >
                    ←{' '}
                  </button>
                  <p>
                    Enter your email address to receive a password reset link.
                  </p>
                  <div className={style.searchInput}>
                    <form onSubmit={handleForgotPassword}>
                      <div className={style.inputGroup}>
                        <input
                          type="email"
                          id="resetEmail"
                          value={email}
                          placeholder="Email"
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setEmail(e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className={style.frmGrp}>
                        <button type="submit" className={style.submit}>
                          {buttonText}
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              )}

              {activeTab === 'subscribe' && !selectedPackage && (
                <>
                  <p>Select a package to subscribe</p>
                  <div className={style.packages}>
                    {packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={style.package}
                        onClick={() => handlePackageSelect(pkg.id, pkg.name)}
                      >
                        <span>{pkg.name}</span>
                        <span>
                          {pkg.price}
                          <sub>£</sub>
                        </span>
                        <span>
                          <ul>
                            {pkg.features.map((featureId: any, index: number) => (
                              <li key={index}>{getFeatureNameById(featureId) || 'Unknown Feature'}</li>
                            ))}
                          </ul>
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'subscribe' && selectedPackage && (
                <>
                  <p>
                    You have selected the {selectedPackageName} plan. Enter your
                    personal information to create your account.
                  </p>
                  <div className={style.searchInput}>
                    <form onSubmit={handleSignUp} className={style.formz}>
                      <div className={style.row}>
                        <div className={style.frmGrp}>
                          <input
                            type="text"
                            autoComplete="off"
                            placeholder="Name"
                            value={name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setName(e.target.value)
                            }
                          />
                          {errors.name && (
                            <div className={style.error}>{errors.name[0]}</div>
                          )}
                        </div>
                        <div className={style.frmGrp}>
                          <input
                            type="email"
                            autoComplete="off"
                            placeholder="Email address"
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setEmail(e.target.value)
                            }
                          />
                          {errors.email && (
                            <div className={style.error}>{errors.email[0]}</div>
                          )}
                        </div>
                      </div>
                      <div className={style.row}>
                        <div className={style.frmGrp}>
                          <div className={style.passwordWrapper}>
                            <input
                              type={passwordVisible ? 'text' : 'password'}
                              autoComplete="new-password"
                              placeholder="Password"
                              value={password}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setPassword(e.target.value)
                              }
                            />
                            <span
                              className={style.eyeIcon}
                              onClick={togglePasswordVisibility}
                            >
                              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                            </span>
                          </div>
                          {errors.password && (
                            <div className={style.error}>
                              {errors.password[0]}
                            </div>
                          )}
                        </div>

                        <div className={style.frmGrp}>
                          <div className={style.passwordWrapper}>
                            <input
                              type={
                                confirmPasswordVisible ? 'text' : 'password'
                              }
                              autoComplete="new-password"
                              placeholder="Confirm Password"
                              value={confirmPassword}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setConfirmPassword(e.target.value)
                              }
                            />
                            <span
                              className={style.eyeIcon}
                              onClick={toggleConfirmPasswordVisibility}
                            >
                              {confirmPasswordVisible ? (
                                <FaEyeSlash />
                              ) : (
                                <FaEye />
                              )}
                            </span>
                          </div>
                          {errors.confirmPassword && (
                            <div className={style.error}>
                              {errors.confirmPassword[0]}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={style.frmGrp}>
                        <button type="submit" className={style.submit}>
                          {buttonText}
                        </button>
                      </div>
                    </form>
                  </div>
                  <p>or sign in with</p>
                  <ul className={style.socialLogin}>
                    <li>
                      <a href="#">Google</a>
                    </li>
                    <li>
                      <a href="#">Apple</a>
                    </li>
                    <li>
                      <a href="#">Discord</a>
                    </li>
                  </ul>
                </>
              )}
            </div>
          )}

          {registrationSuccess && (
            <p className={`${style.thankYou} ${style.fadeIn}`}>
              Thank you for registering! Check your email to activate your
              account. You will be redirected to the homepage in {counter}{' '}
              seconds.
            </p>
          )}
          {showCloseButton && (
            <button onClick={onClose} className={style.close} >
              {/* <AiOutlineClose size={24}/>  style={{ fontSize: '20px !important' }}*/}
              x
            </button>
          )}
        </div>

        <div
          style={{ display: onEditProfile ? 'block' : 'none' }}
          className={style.footer}
        >
          --{userRole ? 'yes' : 'no'}
          {onEditProfile ? (
            <>
              <div className={style.navTabs}>
                {userRole === 'admin' || userRole === 'moderator' ? (
                  <button
                    onClick={() => (window.location.href = '/dashboard')}
                    className={style.dashboardButton}
                  >
                    Go to Dashboard
                  </button>
                ) : null}
                <div>
                  <h2
                    className={`${
                      activeProfileTab === 'account' ? style.active : ''
                    }`}
                    onClick={() => setActiveProfileTab('account')}
                  >
                    Account
                  </h2>
                </div>
                <div>
                  <h2
                    className={`${
                      activeProfileTab === 'subscription' ? style.active : ''
                    }`}
                    onClick={() => setActiveProfileTab('subscription')}
                  >
                    Subscription
                  </h2>
                </div>
                {authUser && (
                  <div>
                    <h2 onClick={handleDashboardNavigation}>Dashboard</h2>
                  </div>
                )}

                <div>
                  <h2 className={style.active1} onClick={onLoggedOut}>
                    Logout
                  </h2>
                </div>
              </div>
            </>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInPopup;
