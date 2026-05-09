import { useContext, useState } from 'react'
import { AccountContext } from '../../../context/AccountProvider'

import { Box, IconButton, styled } from '@mui/material'
import { Group } from '@mui/icons-material'

import HeaderMenu from './HeaderMenu'
import InfoDrawer from '../../drawer/InfoDrawer'
import { emptyProfilePicture } from '../../../constants/data'
import { getProfilePictureUrl, setFallbackImage } from '../../../utils/common-utils'

const Component = styled(Box)`
  height: 60px;
  background: #ededed;
  display: flex;
  padding: 0 16px 0 20px;
  align-items: center;
  box-sizing: border-box;
`

const Wrapper = styled(Box)`
  margin-left: auto;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
`

const ActionButton = styled(IconButton)`
  width: 40px;
  height: 40px;
  padding: 0;
  color: #111b21;
`

const Image = styled('img')({
    height: 40,
    width: 40,
    borderRadius: '50%',
    cursor: 'pointer',
    objectFit: 'cover',
    flexShrink: 0
  })

const Header = () => {
    const [openDrawer, setOpenDrawer] = useState(false)
    const { account } = useContext(AccountContext)
    const picture = getProfilePictureUrl(account, emptyProfilePicture)

    const toggleDrawer = () => {
        setOpenDrawer(true)
    }

    return (
        <>
            <Component>
                <Image
                    title='View Profile'
                    src={picture}
                    alt='DP'
                    onClick={()=>toggleDrawer()}
                    onError={(event) => setFallbackImage(event, emptyProfilePicture)}
                    referrerPolicy="no-referrer"
                />
                <Wrapper>
                    <ActionButton title='Display Friends' aria-label='Display Friends'>
                        <Group fontSize='small' />
                    </ActionButton>
                    <HeaderMenu setOpenDrawer={setOpenDrawer}/>
                </Wrapper>
                <InfoDrawer open={openDrawer} setOpen={setOpenDrawer} />
            </Component>
        </>
    )
}

export default Header
