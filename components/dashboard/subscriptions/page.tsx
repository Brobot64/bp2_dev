import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import style from '../../all.module.css';
import { FaEdit, FaTrash, FaEllipsisH, FaPlus } from 'react-icons/fa';
import Modal from './modal';

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

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete the selected packages?')) {
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        await Promise.all(selectedPackages.map(async (packageId) => {
          await axios.delete(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/packages/${packageId}`,
            {
              headers: {
                Authorization: `${token}`,
              }
            }
          );
        }));
        setPackages(packages.filter(pkg => !selectedPackages.includes(pkg.id)));
        setSelectedPackages([]);
      } catch (error: any) {
        setError('Failed to delete packages.');
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
  const currentPackages = filteredPackages.slice(indexOfFirstPackage, indexOfLastPackage); // Use filteredPackages instead of packages
  const totalPages = Math.ceil(filteredPackages.length / packagesPerPage); // Use filteredPackages.length instead of packages.length

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
    console.log('New Package:', newPackage);

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
              className={style.inputField}
            />
            <input
              type="number"
              placeholder="Price"
              value={newPackage.price}
              onChange={(e) => setNewPackage({ ...newPackage, price: parseFloat(e.target.value) })}
              className={style.inputField}
            />
            <div className={style.featuresContainer}>
              <h4>Select Features</h4>
              {predefinedFeatures.map((feature) => (
                <label key={feature} className={style.featureLabel}>
                  <input
                    type="checkbox"
                    checked={newPackage.features[feature] || false}
                    onChange={(e) => handleFeatureChange(feature, e.target.checked)}
                    className={style.featureCheckbox}
                  />
                  {feature}
                </label>
              ))}
            </div>
            <button className={style.submitButton} onClick={handlePackageSubmit}>Submit</button>
            <button className={style.cancelButton} onClick={() => setIsAddingPackage(false)}>Cancel</button>
          </div>
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
                            <button className={style.dropdownMenuItem}>
                              <FaEdit /> Edit
                            </button>
                            <button className={style.dropdownMenuItem}>
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
