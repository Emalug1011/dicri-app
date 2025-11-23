import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import { logout } from '../../utils/logout'
import { cilUser } from "@coreui/icons";

import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
      <CIcon icon={cilUser} size="xl" />
      </CDropdownToggle>

      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem onClick={logout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
