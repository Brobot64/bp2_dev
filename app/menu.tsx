import React, { useEffect, useState, useRef } from 'react';
import { scroller } from 'react-scroll';
import { Link as ScrollLink } from 'react-scroll';

interface MenuProps {
  activeSection: string;
  handleSetActive: (to: string) => void;
}

const Menu: React.FC<MenuProps> = ({ activeSection, handleSetActive }) => {

  const [activeMenuItem, setActiveMenuItem] = useState<string>('');
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
      setActiveMenuItem(activeSection);
  }, [activeSection]);

  useEffect(() => {
    setMenuVisible(false);
  }, []);

  const scrollToSection = (section: string) => {
    handleSetActive(section);

    scroller.scrollTo(section, {
      duration: 800,
      offset: -70,
      smooth: true,
    });
  };

  const handleSetActiveMenuItem = (to: string) => {
    console.log('Setting active menu item to:', to);
    setActiveMenuItem(to);
  };

  useEffect(() => {
    const container = document.querySelector('.container');
    if (!container) {
      return;
    }
    

    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      const currentSection = Array.from(sections).find(
        (section) => section.getBoundingClientRect().top >= 0
      );


      if (currentSection) {
        setActiveMenuItem(currentSection.getAttribute('data-section') || '');
      }

      if (container.scrollTop > 0) {
        setMenuVisible(true);
      } else {
        setMenuVisible(false);
      }

      const menuItemsContainer = menuRef.current as HTMLElement | null;
      const activeMenuItemElement = menuItemsContainer?.querySelector<HTMLElement>(`#menu_${currentSection?.getAttribute('data-section')}`);
      const scrollPosition = activeMenuItemElement ? activeMenuItemElement.offsetTop : 0;
      
      console.log(scrollPosition);
      
      if (menuItemsContainer) {
        menuItemsContainer.scrollTo({
          top: scrollPosition,
          behavior: 'smooth',
        });
      }
      
      
       
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);



  
  return (
    <div id="menu-items" className={`menu-items ${menuVisible ? 'visible' : 'visible  '}`} ref={menuRef}>
      {/* <ScrollLink
        to="main-section"
        spy={true}
        smooth={true}
        offset={-70}
        duration={800}
        onClick={() => scrollToSection('main-section')}
        onSetActive={() => handleSetActiveMenuItem('main-section')}
        className={`hidden ${activeMenuItem === 'main-section' ? 'hidden' : ''}`}
        style={{ display: 'none' }}
        id='menu_main-section'
        >
        main section
      </ScrollLink> */}

      <ScrollLink
        to="who-we-are"
        spy={true}
        smooth={true}
        offset={-70}
        duration={800}
        onClick={() => scrollToSection('who-we-are')}
        onSetActive={() => handleSetActiveMenuItem('who-we-are')}
        className={activeMenuItem === 'who-we-are' ? 'active' : ''}
        id='menu_who-we-are'
        >
        who we are
      </ScrollLink>

      <ScrollLink
        to="why-we-exist"
        spy={true}
        smooth={true}
        offset={-70}
        duration={800}
        onClick={() => scrollToSection('why-we-exist')}
        onSetActive={() => handleSetActiveMenuItem('why-we-exist')}
        className={activeMenuItem === 'why-we-exist' ? 'active' : ''}
        id='menu_why-we-exist'
        >
        why we exist
      </ScrollLink>

      <ScrollLink
        to="what-we-do"
        spy={true}
        smooth={true}
        offset={-70}
        duration={800}
        onClick={() => scrollToSection('what-we-do')}
        onSetActive={() => ('what-we-do')}
        className={activeMenuItem === 'what-we-do' ? 'active' : ''}
        id='menu_what-we-do'
        >
        what we do
      </ScrollLink>

      <ScrollLink
        to="whom-we-work-for"
        spy={true}
        smooth={true}
        offset={-70}
        duration={800}
        onClick={() => scrollToSection('whom-we-work-for')}
        onSetActive={() => handleSetActiveMenuItem('whom-we-work-for')}
        className={activeMenuItem === 'whom-we-work-for' ? 'active' : ''}
        id='menu_whom-we-work-for'
        >
        whom we work for
      </ScrollLink>

      <ScrollLink
        to="how-we-work"
        spy={true}
        smooth={true}
        offset={-70}
        duration={800}
        onClick={() => scrollToSection('how-we-work')}
        onSetActive={() => handleSetActiveMenuItem('how-we-work')}
        className={activeMenuItem === 'how-we-work' ? 'active' : ''}
        id='menu_how-we-work'
        >
        how we work
      </ScrollLink>

      {/* <ScrollLink
        to="journal"
        spy={true}
        smooth={true}
        offset={-70}
        duration={800}
        onClick={() => scrollToSection('journal')}
        onSetActive={() => handleSetActiveMenuItem('journal')}
        className={activeMenuItem === 'journal' ? 'active' : ''}
        id='menu_journal'
        >
        journal
      </ScrollLink> */}

      <ScrollLink
        to="contact-jobs"
        spy={true}
        smooth={true}
        offset={-70}
        duration={800}
        onClick={() => scrollToSection('contact-jobs')}
        onSetActive={() => handleSetActiveMenuItem('contact-jobs')}
        className={activeMenuItem === 'contact-jobs' ? 'active' : ''}
        id='menu_contact-jobs'
        >
        contact | jobs
      </ScrollLink>
    </div>

    
    
  );
};

export default Menu;
