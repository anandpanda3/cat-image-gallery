import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';

const App = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  const fetchImages = useCallback(async (pageNum, mode) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://api.thecatapi.com/v1/images/search?limit=10&page=${pageNum}&order=Desc`);
      if (mode === 'infinite') {
        setImages(prev => [...prev, ...response.data]);
      } else {
        setImages(response.data);
      }
      setHasMore(response.data.length === 10);
    } catch (err) {
      setError('Failed to fetch images. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages(page, viewMode);
  }, [page, viewMode, fetchImages]);

  const handleNextPage = () => setPage(prev => prev + 1);
  const handlePrevPage = () => setPage(prev => Math.max(1, prev - 1));

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setPage(1);
    setImages([]);
  };

  const renderGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {images.map(image => (
        <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
          <img src={image.url} alt="Cat" className="w-full h-48 object-cover" />
        </div>
      ))}
    </div>
  );

  const renderColumn = () => (
    <div className="flex flex-col space-y-4 max-w-3xl mx-auto">
      {images.map(image => (
        <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
          <img src={image.url} alt="Cat" className="w-full h-auto object-cover" />
        </div>
      ))}
    </div>
  );

  const renderInfiniteScroll = () => (
    <InfiniteScroll
      dataLength={images.length}
      next={() => setPage(prev => prev + 1)}
      hasMore={hasMore}
      loader={<h4 className="text-center my-4 font-semibold text-gray-700">Loading more cats...</h4>}
    >
      <div className="flex flex-col space-y-4 max-w-3xl mx-auto">
        {images.map(image => (
          <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
            <img src={image.url} alt="Cat" className="w-full h-auto object-cover" />
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="container mx-auto p-4">
        <h1 className="text-5xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-serif">
          Purrfect Cat Gallery
        </h1>
        <div className="mb-8 flex justify-center space-x-4">
          {['grid', 'column', 'infinite'].map((mode) => (
            <button
              key={mode}
              className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${
                viewMode === mode
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white text-purple-600 hover:bg-purple-100'
              } shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-sans`}
              onClick={() => handleViewModeChange(mode)}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)} View
            </button>
          ))}
        </div>
        {loading && <p className="text-center text-gray-700 font-semibold animate-pulse">Loading adorable cats...</p>}
        {error && <p className="text-center text-red-600 font-semibold">{error}</p>}
        {images.length === 0 && !loading && !error && (
          <p className="text-center text-gray-700 font-semibold">No cat images found. Try refreshing!</p>
        )}
        <div className="bg-white bg-opacity-60 rounded-xl p-6 shadow-lg">
          {viewMode === 'grid' && renderGrid()}
          {viewMode === 'column' && renderColumn()}
          {viewMode === 'infinite' && renderInfiniteScroll()}
        </div>
        {viewMode !== 'infinite' && (
          <div className="mt-8 flex justify-center space-x-4">
            <button
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed font-sans"
              onClick={handlePrevPage}
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed font-sans"
              onClick={handleNextPage}
              disabled={!hasMore}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;