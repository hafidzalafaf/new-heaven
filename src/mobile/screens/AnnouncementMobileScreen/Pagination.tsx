import * as React from 'react';



interface PaginationProps {
    nPages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}


const Pagination:React.FC<PaginationProps> = ({nPages, currentPage, setCurrentPage}) => {

    const pageNumbers = [...Array(nPages +1).keys()].slice(1);
    const nextPage = () => {
        if(currentPage !== nPages) 
            setCurrentPage(currentPage + 1)
    }
    const prevPage = () => {
        if(currentPage !== 1) 
            setCurrentPage(currentPage - 1)
    }

  return (
    <nav className='mx-auto px-auto w-80 my-2 text-xs'>
        <section style={{
            'listStyleType': 'none'
        }} className="d-flex flex-row grey-text-accent justify-content-center">
            <li onClick={prevPage} className="mr-2 border p-1 rounded-lg">
                <div className="" aria-label="Previous">
                    <span aria-hidden="true">Previous</span>
                </div>
            </li>
            {pageNumbers.map(number => (
                <li key={number} className={` ${currentPage === number ? 'bg-secondary' : ''} rounded-lg border mx-1`}>
                    <div onClick={() => setCurrentPage(number)} className="mx-2 my-1">
                        {number}
                    </div>
                </li>
            ))}
            <li onClick={nextPage} className="ml-2 border p-1 rounded-lg">
                <div className="" aria-label="Next">
                    <span aria-hidden="true">Next</span>
                </div>
            </li>
        </section>
    </nav>
  )
}

export {Pagination}