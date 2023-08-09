import './electron-vite-title-bar-classes'

// SVG Path value of icon for indicate has sub menu
const expandSubMenuSvgPath = 'M543.846-480.231 353.538-671.308l22.231-22.231 212.539 213.308-212.539 212.539-22.231-22.231 190.308-190.308Z'
// SVG Path value of icon for indicate collapsed menu
const collapseMenuSvgPath = 'M207.858-432Q188-432 174-446.142q-14-14.141-14-34Q160-500 174.142-514q14.141-14 34-14Q228-528 242-513.858q14 14.141 14 34Q256-460 241.858-446q-14.141 14-34 14Zm272 0Q460-432 446-446.142q-14-14.141-14-34Q432-500 446.142-514q14.141-14 34-14Q500-528 514-513.858q14 14.141 14 34Q528-460 513.858-446q-14.141 14-34 14Zm272 0Q732-432 718-446.142q-14-14.141-14-34Q704-500 718.142-514q14.141-14 34-14Q772-528 786-513.858q14 14.141 14 34Q800-460 785.858-446q-14.141 14-34 14Z'

class ElectronViteTitleBarMenu {
  /**
   * Constructor
   * @param {<section> element that has menu elements.} container 
   * @param {<section> element of ElectronViteTitleBar component.} frameContainer 
   * @param {<section> element that has title element.>} titleContainer 
   * @param {The emitter instance that fires the menu click event} emitter 
   */
  constructor (container, frameContainer, titleContainer, emitter) {
    if (!(container instanceof HTMLElement)) {
      let containerName = container ? container.constructor.name : container 
      throw TypeError(`container must be <section>. but got ${containerName}.`)
    }
    if (!(frameContainer instanceof HTMLElement)) {
      let frameContainerName = frameContainer ? frameContainer.constructor.name : frameContainer
      throw TypeError(`frameContainer must be <section>. but got ${frameContainerName}.`)
    }
    if (!(titleContainer instanceof HTMLElement)) {
      let titleContainerName = titleContainer ? titleContainer.constructor.name : titleContainer
      throw TypeError(`titleContainer must be <section>. but got ${titleContainerName}.`)
    }
    if (!(emitter instanceof Function)) {
      let emitterName = emitter ? emitter.constructor.name : emitter
      throw TypeError(`emitter must be Function. but got ${emitterName}.`)
    }

    this.container = container
    this.frameContainer = frameContainer
    this.titleContainer = titleContainer
    this.isMenuActivated = false
    this.emitter = emitter
    this.menuList = undefined
  }

  /**
   * Setting menu infomation and validate.
   * @param {list of menu info that is consist of JSON Array} menuList 
   */
  setMenuInfo (menuList) {
    if (Array.isArray(menuList)) {
      throw TypeError(`menuList must be Array. but got ${menuList ? menuList.constructor.name : menuList}.`)
    }

    for (const menuInfo of menuList) {
      const validation = this.validateMenuInfo(menuInfo)
      if (!validation.success) {
        console.error(validation.error, validation.menuInfo)
      }
    }

    this.menuList = menuList
  }

  /**
   * Validate menu information.
   * @param {menu info that is consist of JSON} menuInfo 
   * @returns 
   */
  validateMenuInfo (menuInfo) {
    if (menuInfo.label == undefined && !menuInfo.separator) {
      return MenuValidation(false, `menuInfo needs 'label' or 'separator'.`, menuInfo)
    } else if (menuInfo.label != undefined && menuInfo.separator) {
      return MenuValidation(false, `menuInfo can't have both 'label' and 'separator'`, menuInfo)
    } else if (menuInfo.hotKey != undefined && menuInfo.subMenu != undefined) {
      return MenuValidation(false, `menuInfo can't have both 'hotKey' and 'subMenu'`, menuInfo)
    }

    if (menuInfo.separator) return
    if (menuInfo.hotKey) {

    }
    if (menuInfo.subMenu != undefined) {
      for (const subMenuInfo of menuInfo.subMenu) {
        const validation = this.validateMenuInfo(subMenuInfo)
        if (!validation.success) {
          return validation
        }
      }
    }
    return MenuValidation(ture, `success`, menuInfo)
  }

  /**
   * Create root menu items.
   */
  createRootMenu () {
    const rootGroup = this.container.querySelector('ul.evtb-menu-group[level="0"]')
    if (rootGroup != null) {
      rootGroup.remove()
    }

    const group = this.createMenuGroup(0)
    this.container.appendChild(group)

    let index = 0
    const frameContainerWidth = this.frameContainer.getBoundingClientRect().width

    if (frameContainerWidth > 480) {
      for (index; index < this.menuList.length; index++) {
        const menuItem = this.createMenuItem(0, this.menuList[index])
        group.appendChild(menuItem)

        const menuContainerWidth = this.container.getBoundingClientRect().width
        const menuContainerX = this.container.getBoundingClientRect().x
        const titleContainerX = this.titleContainer.getBoundingClientRect().x
        const tileContainerVisible = this.titleContainer.style.visibility == 'visible'
  
        // If overlap elements menu container and title container when create menu. 
        if (tileContainerVisible && (menuContainerWidth + menuContainerX) >= (titleContainerX - 20)) {
          // Delete the second node from the end to make space for the collapse menu.
          group.removeChild(menuItem)
          if (group.hasChildNodes() && group.lastChild) {
            group.removeChild(group.lastChild)
          }
          index--
          break;
        }
      }
    }

    this.addMenuDestroyListener()

    // If when create menu, doesn't created all menu
    // create collapse menu includes all remain menu by menu item.
    if (index != this.menuList.length) {
      const collapseElement = document.createElement('li')
      collapseElement.setAttribute('type', 'menu')
      collapseElement.classList.add('evtb-menu-item-0')
      collapseElement.classList.add('collapse')
      collapseElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="48" height="48"><path d="' + collapseMenuSvgPath + '"/></svg>'
      group.appendChild(collapseElement)

      const collapseMenu = {
        label: '',
        subMenu: []
      }

      for (index; index < this.menuList.length; index++) {
        collapseMenu.subMenu.push(this.menuList[index])
      }

      this.addMenuClickListener(collapseElement, 0, collapseMenu)
      this.addMenuOverListener(collapseElement, 0, collapseMenu)
    }
  }

  createMenu (root, level, menuList) {
    const group = this.createMenuGroup(level)
    if (root) {
      this.adjustGroupPosition(root, level, group)
    }

    if (level > 0) {
      this.setMenuSelected(level - 1, root)
    }

    menuList.forEach(menuInfo => {
      const element = this.createMenuItem(level, menuInfo)
      group.appendChild(element)
    })

    this.container.appendChild(group)
  }

  createMenuGroup (level) {
    const group = document.createElement('ul')
    group.setAttribute('level', String(level))
    group.classList.add('evtb-menu-group')
    return group
  }

  adjustGroupPosition (parentElement, level, element) {
    let top = 0
    let left = 0

    if (level == 1) {
      top = parentElement.getBoundingClientRect().height
      left = parentElement.getBoundingClientRect().x
    } else if (level > 1) {
      top = (parentElement.getBoundingClientRect().y - 5)
      left = parentElement.getBoundingClientRect().x + parentElement.getBoundingClientRect().width
    }

    const subGroupRightPositionX = left + parentElement.getBoundingClientRect().width
    if (subGroupRightPositionX > window.innerWidth) {
      left -= (subGroupRightPositionX - window.innerWidth) + 10
      top += 10
    }

    element.style.top = Math.floor(top) + 'px'
    element.style.left = left + 'px'
  }

  crateMenuItem (level, menuInfo) {
    const element = document.createElement('li')
    if (menuInfo.separator) {
      element.setAttribute('type', 'separator')
    }

    if (menuInfo.label) {
      element.setAttribute('type', 'menu')
      element.setAttribute('value', menuInfo.label)
      element.classList.add('evtb-menu-item-' + level)
      element.innerHTML = '<span class="evtb-menu-item-label">' + menuInfo.label + '</span>'

      if (level >= 1 && menuInfo.subMenu != undefined) {
        element.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="48" height="48"><path d="' + expandSubMenuSvgPath + '"/></svg>'
      } else if (level >= 1 && menuInfo.hotKey != undefined) {
        element.innerHTML += '<span class="evtb-menu-item-hotkey">' + menuInfo.hotKey + '</span>'
      }

      this.addMenuClickListener(element, level, menuInfo)
      this.addMenuOverListener(element, level, menuInfo)
    }
    return element
  }

  addMenuDestroyListener () {
    document.addEventListener('click', (e) => {
      let isMenuClicked = false

      const groups = this.container.querySelectorAll('ul.evtb-menu-group:not([level="0"])')
      groups.forEach(group => {
        if (e.target == group) {
          isMenuClicked = true
        }
      })
      
      if (!isMenuClicked) {
        this.destroyMenuGroup(1)
        this.isMenuActivated = false
      }
    })
  }

  addHotkeyEventListener (menuInfo) {
    const hotkey = menuInfo.hotkey
    if (hotkey == undefined || hotkey == null) {
      return MenuValidation(false, `hotkey value must be String. but got ${hotkey}.`)
    } else {
      window.addEventListener('keydown', (e) => {
        const keys = hotkey.split('+')
        let hasCtrl = false
        let hasAlt = false
        let hasShift = false

        if (keys.includes('Ctrl')) {
          hasCtrl = true
          keys.splice(keys.indexOf('Ctrl'), 1)
        }
        if (keys.includes('Alt')) {
          hasAlt = true
          keys.splice(keys.indexOf('Alt'), 1)
        }
        if (keys.includes('Shift')) {
          hasShift = true
          keys.splice(keys.indexOf('Shift'), 1)
        }

        if (keys.length < 1) {
          console.error(`hotkey doesn't have key without Ctrl, Alt, Shift`, menuInfo)
        }

        if (e.ctrlKey == hasCtrl && e.altKey == hasAlt && e.shiftKey == hasShift && e.key.toUpperCase() == keys[0].toUpperCase()) {
          e.preventDefault()
          this.destroyMenuGroup(1)
          this.isMenuActivated = false
          this.emitter('onMenuClick', menuInfo.label)
        }
      })
      return MenuValidation(true, 'success', menuInfo)
    }
  }

  addMenuClickListener (menuElement, level, menuInfo) {
    menuElement.addEventListener('click', (e) => {
      e.stopPropagation()
      if (menuInfo.subMenu != undefined) {
        const selectedElement = this.getMenuSelected(level)
        if (menuElement == selectedElement && level == 0) {
          this.destroyMenuGroup(1)
          this.setMenuSelected(level, null)
          this.isMenuActivated = false
        } else {
          this.destroyMenuGroup(level + 1)
          this.createMenu(menuElement, level + 1, menuInfo.subMenu)
          this.isMenuActivated = true
        }
      } else {
        this.destroyMenuGroup(1)
        this.isMenuActivated = false
        this.emitter('onMenuClick', menuInfo.label)
      }
    })
  }

  addMenuOverListener (menuElement, level, menuInfo) {
    menuElement.addEventListener('mouseover', (e) => {
      e.stopPropagation()
      if (!this.isMenuActivated) return
      this.destroyMenuGroup(level + 1)
      if (menuInfo.subMenu != undefined) {
        this.createMenu(menuElement, level + 1, menuInfo.subMenu)
      }
    })
  }

  destroyMenuGroup (level) {
    const groups = this.container.querySelectorAll('ul.evtb-menu-group')
    groups.forEach(group => {
      const groupLevel = Number(group.getAttribute('level'))
      if (groupLevel >= level) {
        if (groupLevel == 1) {
          this.setMenuSelected(0, null)
        }
        group.remove()
      }
    })
  }

  setMenuSelected (level, clickedElement) {
    if (!(clickedElement instanceof HTMLLIElement || clickedElement == null)) {
      throw TypeError(`clickedElement must be HTMLLIElement or null. but got ${clickedElement ? clickedElement.constructor.name : clickedElement}.`)
    }
    const elements = this.container.querySelectorAll('li.evtb-menu-item-' + level)
    elements.forEach(li => {
      if (li != clickedElement && li.classList.contains('selected')) {
        li.classList.remove('selected')
      }
      if (li == clickedElement && !li.classList.contains('selected')) {
        li.classList.add('selected')
      }
    })
  }

  getMenuSelected (level) {
    return this.container.querySelector('li.evtb-menu-item-' + level + '.selected')
  }
}

export default ElectronViteTitleBarMenu