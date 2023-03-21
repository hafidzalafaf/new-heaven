import React from 'react'
import { useHistory } from 'react-router'
import { ArrowLeft, ArrowRightL } from 'src/mobile/assets/Arrow'
import P2PMobileHelpPlaceholder from '../../../assets/images/MobileP2PHelpPlaceholder-1.png'
import P2PMobileHelpPlaceholderTwo from '../../../assets/images/MobileP2PHelpPlaceholder-2.png'
import P2PMobileHelpPlaceholderThree from '../../../assets/images/MobileP2PHelpPlaceHolder-3.png'
import P2PMobileHelpPlaceholderFour from '../../../assets/images/MobileP2PHelpPlaceHolder-4.png'




import './P2PFAQMobileScreen.pcss'
export const P2PFAQMobileScreen = () => {
    const history = useHistory()

    const [currentPage, setCurrentPage] = React.useState(1);


    const P2PHelpPagination = () => {
        return (
            <section className='d-flex flex-row align-items-center justify-content-around'>
                <div onClick={currentPage > 1 ? () => setCurrentPage(currentPage -1) : null} className='arrow-container rounded'>
                    <ArrowRightL className={'rotate-180deg'}/>
                </div>
                <div className={`${currentPage >= 1 && `active-page-indicator`} page-indicator rounded`}/>
                <div className={`${currentPage >= 2 && `active-page-indicator`} page-indicator rounded`}/>
                <div className={`${currentPage >= 3 && `active-page-indicator`} page-indicator rounded`}/>
                <div className={`${currentPage >= 4 && `active-page-indicator`} page-indicator rounded`}/>
                <div onClick={currentPage < 4 ? () => setCurrentPage(currentPage +1) : null} className='arrow-container rounded'>
                    <ArrowRightL className={''}/>
                </div>
            </section>
        )
    }






  return (
    <section className='pg-mobile-screen-p2p mobile-container'>
        <div className="d-flex justify-content-start align-items-center mb-32">
            <div onClick={() => history.goBack()}>
            <ArrowLeft className={'cursor-pointer'} />
            </div>
            <p className="m-0 p-0 grey-text-accent text-md font-extrabold mx-auto">P2P Help Center</p>
        </div>
        <div className='d-flex flex-column justify-content-between'>
            <h5 className='grey-text-accent'>Welcome to Heaven Exchange P2P</h5>
            <span className='grey-text-accent text-xs'>P2P platform allows user to buy or sell crypto directly from other users</span>
            {
                currentPage === 1 ?
                <img
                    src={P2PMobileHelpPlaceholder}
                    alt='placeholder'
                    className='img-placeholder'
                />
                : currentPage === 2 ?
                <img
                    src={P2PMobileHelpPlaceholderTwo}
                    alt='placeholder'
                    className='img-placeholder'
                />
                : currentPage === 3 ?
                <img
                    src={P2PMobileHelpPlaceholderThree}
                    alt='placeholder'
                    className='img-placeholder'
                /> 
                :
                <img
                    src={P2PMobileHelpPlaceholderFour}
                    alt='placeholder'
                    className='img-placeholder'
                />
            }
        </div>
        <P2PHelpPagination/>
    </section>
  )
}