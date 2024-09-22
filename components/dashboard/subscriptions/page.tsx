import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import style from '../../all.module.css';
import { FaEdit, FaTrash, FaEllipsisH, FaPlus } from 'react-icons/fa';
import Modal from './modal';
import MessagePopup from '../popups/MessagePopup';

type Package = {
  id: number;
  name: string;
  price: number;
  features: { [key: string]: boolean };
};

const predefinedFeatures = [
  'Feature 1',
  'Feature 2',
  'Feature 3',
  'Feature 4',
  'Feature 5',
  'Feature 6'
];

const Subscriptions: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [packagesPerPage] = useState(10);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [newPackage, setNewPackage] = useState<Package>({ id: 0, name: '', price: 0, features: {} });
  const [isAddingPackage, setIsAddingPackage] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Added By Brobot
  const [editPackage, setEditPackages] = useState<Package>();
  const [isEditingPackage, setIsEditingPackage] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<{ [key: string]: boolean }>({});
  const handleEditingPackage = (pkg: any) => {
    setEditPackages(pkg);
    const initialSelected = predefinedFeatures.reduce((acc, feature) => {
      acc[feature] = pkg.features.includes(feature); // Check if the feature is in the API data
      return acc;
    }, {} as { [key: string]: boolean });

    setSelectedFeatures(initialSelected);
    setIsEditingPackage(true); 
  };

   // Handle checkbox change for features
   const handleCheckboxChange = (feature: string) => {
    setSelectedFeatures((prev) => ({
      ...prev,
      [feature]: !prev[feature], // Toggle feature selection
    }));
  };

  const handleEditFeatureChange = (featureKey: string) => {
    if (editPackage) {
      setEditPackages({
        ...editPackage,
        features: {
          ...editPackage.features,
          [featureKey]: !editPackage.features[featureKey], 
        },
      });
      console.log("bush: ", editPackage);
    }
  };

  const closeSuccessMessage = () => setSuccessMessage('');

  // Close error message
  const closeErrorMessage = () => setError('');


  const handleSave = async (id: any) => {
    const token = localStorage.getItem('token');
    const selectedFeatureList = Object.keys(selectedFeatures).filter(
      (feature) => selectedFeatures[feature]
    );
    const updatedPackage = {
      ...editPackage,
      features: selectedFeatureList,
    };
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/packages/${id}`, updatedPackage, {
        headers: {
          Authorization: `${token}`,
        },
      })
      setSuccessMessage("Package Updated Successfully")
    } catch (error: any) {
      console.error(error);
      setError('Failed to load packages.');
    } finally {
      setIsEditingPackage(false);
    }
  }

  // Ended Here

  useEffect(() => {
    const fetchPackages = async () => {
      // setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/packages`,
          {
            headers: {
              Authorization: `${token}`,
            }
          }
        );
        const fetchedPackages: Package[] = Array.isArray(response.data) ? response.data : [];
        setPackages(fetchedPackages);
      } catch (error: any) {
        setError('Failed to load packages.');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    const filtered = packages.filter(pkg =>
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPackages(filtered);
  }, [searchQuery, packages]);

  
  const handleDelete = async (id: any) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      setLoading(true);
      const token = localStorage.getItem('token');
  
      try {
        // Delete the package by its ID
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/packages/${id}`,
          {
            headers: {
              Authorization: `${token}`,
            }
          }
        );
  
        setPackages(packages.filter(pkg => pkg.id !== id));
      } catch (error: any) {
        console.error('Failed to delete package:', error);
        setError('Failed to delete package. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };
  

  const toggleMenu = (packageId: number) => {
    setOpenMenuId(openMenuId === packageId ? null : packageId);
  };

  const toggleSelectPackage = (packageId: number) => {
    if (selectedPackages.includes(packageId)) {
      setSelectedPackages(selectedPackages.filter(id => id !== packageId));
    } else {
      setSelectedPackages([...selectedPackages, packageId]);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const indexOfLastPackage = currentPage * packagesPerPage;
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
  const currentPackages = filteredPackages.slice(indexOfFirstPackage, indexOfLastPackage);
  const totalPages = Math.ceil(filteredPackages.length / packagesPerPage);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleAddPackage = () => {
    setIsAddingPackage(true); 
  };

  const handleFeatureChange = (feature: string, isChecked: boolean) => {
    setNewPackage({
      ...newPackage,
      features: {
        ...newPackage.features,
        [feature]: isChecked,
      },
    });
  };

  const handlePackageSubmit = async () => {
    setError('');
    const selectedFeatureList = Object.keys(newPackage.features).filter(
      (feature) => newPackage.features[feature]
    );
    const updatedPackage = {
      ...newPackage,
      features: selectedFeatureList,
    };
    const token = localStorage.getItem('token');
    try {
      const data = updatedPackage;
      console.log(data);
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/packages`, data, {
        headers: {
          Authorization: `${token}`,
        },
      });
    } catch (error: any) {
      console.log(error);
      setError(error);
    }

    setIsAddingPackage(false);
    setNewPackage({ id: 0, name: '', price: 0, features: {} });
  };

  const handlePackageSelect = (packageName: string) => {
    console.log('Selected Package:', packageName);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={style.cardContainer}>
      <div className={` ${style.card} ${style.w100} `}>
        <div className={style.header}>
          <div>
            <span>Manage Subscriptions</span>
          </div>
          <div className={style.options}>
            <button className={`btn ${style.headerBtn}`} onClick={handleAddPackage}>
              <FaPlus /> Add Package
            </button>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={style.searchInput}
            />
          </div>
        </div>
        
        <Modal isOpen={isAddingPackage} onClose={() => setIsAddingPackage(false)}>
          <div className={style.addPackageForm}>
            <h3>Add New Package</h3>
            <input
              type="text"
              placeholder="Package Name"
              value={newPackage.name}
              onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
              className={`${style.inputField} border-b-2 mr-2 mb-2`}
            />
            <input
              type="number"
              placeholder="Price"
              value={newPackage.price}
              onChange={(e) => setNewPackage({ ...newPackage, price: parseFloat(e.target.value) })}
              className={`${style.inputField} border-b-2 ml-2 mb-2`}
            />
            {/* {style.featuresContainer} */}
            <div className="flex flex-col gap-2">
              <h4 className='font-[600]'>Select Features</h4>
              {predefinedFeatures.map((feature) => (
                <label key={feature} className={style.featureLabel}>
                  <input
                    type="checkbox"
                    checked={newPackage.features[feature] || false}
                    onChange={(e) => handleFeatureChange(feature, e.target.checked)}
                    className={`${style.featureCheckbox} mx-2`}
                  />
                  {feature}
                </label>
              ))}
            </div>
            <button className={`${style.submitButton} p-1 px-2 mx-2 bg-slate-300 rounded mt-2`} onClick={handlePackageSubmit}>Submit</button>
            <button className={`${style.cancelButton}  p-1 px-2 mx-2 bg-slate-300 rounded mt-2`} onClick={() => setIsAddingPackage(false)}>Cancel</button>
          </div>
          { error && <MessagePopup message={error} onClose={closeErrorMessage}/> }
          { successMessage && <MessagePopup message={successMessage} onClose={closeSuccessMessage}/> }
          { isEditingPackage && loading && <>[ loading..... ]</> }
        </Modal>

        <Modal isOpen={isEditingPackage} onClose={() => setIsEditingPackage(false)}>
          <h1 className='text-[25px] mb-3'>[ Edit Packages ]</h1>
          <div className="editModal flex justify-between">
            <div className="formy flex flex-col">
              <label htmlFor="">[ name ]</label>
              <input type="text" value={editPackage ? editPackage.name : ''} className={`${style.inputField} border-b-2 ml-2 mb-2 outline-none`}
              onChange={(e) => setEditPackages(
                // @ts-ignore
                editPackage ? { ...editPackage, name: e.target.value } : null
                )}/>
            </div>

            <div className="formy flex flex-col">
              <label htmlFor="">[ price ]</label>
              <input type="number" value={editPackage ? editPackage.price : ''} className={`${style.inputField} border-b-2 ml-2 mb-2 outline-none`}
              onChange={(e) => setEditPackages(
                // @ts-ignore
                editPackage ? { ...editPackage, price: e.target.value } : null
                )} />
            </div>
          </div>
          
          <h3 className='text-orange-900 my-2'>[ Features ]</h3>
          <div className="features capitalize w-full flex flex-wrap gap-7 gap-y-1">
            
            

            {predefinedFeatures.map((feature) => (
              <div key={feature} className="indFt flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedFeatures[feature] || false}
                  onChange={() => handleCheckboxChange(feature)}
                />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <button className='bg-slate-500 hover:bg-slate-300 cursor-pointer rounded px-5 py-1 capitalize text-white hover:text-black mt-4' onClick={() => handleSave(editPackage?.id)}>
            save
          </button>
        </Modal>

        {/* Rest of your component */}
        <div className={style.body}>
          <div className={style.tableContainer}>
            <table className={style.table}>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={() => {
                        const allPackageIds = currentPackages.map(pkg => pkg.id);
                        if (selectedPackages.length === allPackageIds.length) {
                          setSelectedPackages([]);
                        } else {
                          setSelectedPackages(allPackageIds);
                        }
                      }}
                      checked={selectedPackages.length === currentPackages.length}
                      className={style.checkbox}
                    />
                  </th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Features</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPackages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedPackages.includes(pkg.id)}
                        onChange={() => toggleSelectPackage(pkg.id)}
                        className={style.checkbox}
                      />
                    </td>
                    <td>{pkg.name}</td>
                    <td>{pkg.price}</td>
                    <td>
                      {Object.keys(pkg.features)
                        .filter((feature) => pkg.features[feature])
                        .map((feature) => (
                          <span key={feature} className={style.featureTag}>{feature}</span>
                        ))}
                    </td>
                    <td className={style.actionsColumn}>
                        <button
                          onClick={() => toggleMenu(pkg.id)}
                          className={style.menuButton}
                        >
                          <FaEllipsisH />
                        </button>
                        {openMenuId === pkg.id && (
            <div ref={menuRef} className={style.menu}>
                            <button className={style.dropdownMenuItem} onClick={() => handleEditingPackage(pkg)}>
                              <FaEdit /> Edit
                            </button>
                            <button className={style.dropdownMenuItem} onClick={() => handleDelete(pkg.id)}>
                              <FaTrash /> Delete
                            </button>
                          </div>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className={style.footer}>
          <ul className={style.pagination}>
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index}
                className={currentPage === index + 1 ? style.activePage : ''}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
