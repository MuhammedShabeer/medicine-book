import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  BookOpen, 
  FileText, 
  Download, 
  Upload, 
  RotateCcw,
  Layers,
  Sparkles,
  Loader2,
  FileUp,
  X,
  Search,
  ArrowUp,
  ArrowDown,
  ListFilter,
  CheckCircle2,
  Bookmark
} from 'lucide-react';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;

const PdfBookReader = ({ pdfUrl, title = "Magistral Preparations Book", onUploadClick, isAdmin, documentList = [], onSelectDocument }) => {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.1);
  const [isTwoPage, setIsTwoPage] = useState(true);
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageInput, setPageInput] = useState('1');
  const [flipAnimation, setFlipAnimation] = useState('');

  // Search States
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [showResultsDrawer, setShowResultsDrawer] = useState(false);

  const containerRef = useRef(null);
  const leftCanvasRef = useRef(null);
  const rightCanvasRef = useRef(null);
  const singleCanvasRef = useRef(null);
  const searchInputRef = useRef(null);
  const pageTextCacheRef = useRef({});

  // Auto-detect mobile screen and default to single page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 900) {
        setIsTwoPage(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load PDF Document
  useEffect(() => {
    let isCancelled = false;

    if (!pdfUrl) {
      setLoading(false);
      setPdfDoc(null);
      setNumPages(0);
      pageTextCacheRef.current = {};
      setSearchResults([]);
      setCurrentResultIndex(-1);
      return;
    }

    setLoading(true);
    setError(null);
    pageTextCacheRef.current = {};
    setSearchResults([]);
    setCurrentResultIndex(-1);

    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    loadingTask.promise
      .then((doc) => {
        if (!isCancelled) {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
          setCurrentPage(1);
          setPageInput('1');
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error("PDF load error:", err);
          setError("Failed to load PDF document. Please ensure the file is valid.");
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [pdfUrl]);

  // Full-Text Search Handler
  const handlePerformSearch = async (queryToSearch) => {
    const query = (queryToSearch !== undefined ? queryToSearch : searchQuery).trim();
    if (!pdfDoc || !query) {
      setSearchResults([]);
      setCurrentResultIndex(-1);
      return;
    }

    setIsSearching(true);
    const results = [];
    const lowerQuery = query.toLowerCase();

    try {
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        let pageText = pageTextCacheRef.current[i];

        if (!pageText) {
          const page = await pdfDoc.getPage(i);
          const textContent = await page.getTextContent();
          pageText = textContent.items.map(item => item.str).join(' ');
          pageTextCacheRef.current[i] = pageText;
        }

        const lowerPageText = pageText.toLowerCase();
        let matchPos = lowerPageText.indexOf(lowerQuery);

        while (matchPos !== -1) {
          // Extract a preview snippet around the match
          const start = Math.max(0, matchPos - 40);
          const end = Math.min(pageText.length, matchPos + query.length + 50);
          const snippetPrefix = start > 0 ? '...' : '';
          const snippetSuffix = end < pageText.length ? '...' : '';
          const snippet = snippetPrefix + pageText.substring(start, end).replace(/\s+/g, ' ') + snippetSuffix;

          results.push({
            pageNum: i,
            snippet: snippet,
            matchIndex: matchPos
          });

          // Look for next match on the same page
          matchPos = lowerPageText.indexOf(lowerQuery, matchPos + lowerQuery.length + 1);
        }
      }

      setSearchResults(results);

      if (results.length > 0) {
        setCurrentResultIndex(0);
        goToPage(results[0].pageNum);
      } else {
        setCurrentResultIndex(-1);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleNextSearchMatch = () => {
    if (searchResults.length === 0) return;
    const nextIdx = (currentResultIndex + 1) % searchResults.length;
    setCurrentResultIndex(nextIdx);
    goToPage(searchResults[nextIdx].pageNum);
  };

  const handlePrevSearchMatch = () => {
    if (searchResults.length === 0) return;
    const prevIdx = (currentResultIndex - 1 + searchResults.length) % searchResults.length;
    setCurrentResultIndex(prevIdx);
    goToPage(searchResults[prevIdx].pageNum);
  };

  const handleSelectSearchResult = (index) => {
    setCurrentResultIndex(index);
    goToPage(searchResults[index].pageNum);
    setShowResultsDrawer(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setCurrentResultIndex(-1);
    setShowResultsDrawer(false);
  };

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
    if (!showSearchBar) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  // Render a specific page to a canvas
  const renderPageToCanvas = useCallback(async (pageNum, canvasRef) => {
    if (!pdfDoc || !canvasRef.current || pageNum < 1 || pageNum > pdfDoc.numPages) {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      return;
    }

    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      await page.render(renderContext).promise;
    } catch (err) {
      console.warn("Page render cancelled or failed:", err);
    }
  }, [pdfDoc, scale]);

  // Trigger render when currentPage, scale, isTwoPage, or pdfDoc changes
  useEffect(() => {
    if (!pdfDoc || loading) return;

    setRendering(true);

    const performRender = async () => {
      if (isTwoPage) {
        if (currentPage === 1) {
          // Cover page: render on right canvas, clear left
          if (leftCanvasRef.current) {
            const ctx = leftCanvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, leftCanvasRef.current.width, leftCanvasRef.current.height);
          }
          await renderPageToCanvas(1, rightCanvasRef);
        } else {
          // Regular spread: Left page is even, Right page is odd
          const leftPageNum = currentPage % 2 === 0 ? currentPage : currentPage - 1;
          const rightPageNum = leftPageNum + 1;

          await renderPageToCanvas(leftPageNum, leftCanvasRef);
          if (rightPageNum <= numPages) {
            await renderPageToCanvas(rightPageNum, rightCanvasRef);
          } else if (rightCanvasRef.current) {
            const ctx = rightCanvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, rightCanvasRef.current.width, rightCanvasRef.current.height);
          }
        }
      } else {
        await renderPageToCanvas(currentPage, singleCanvasRef);
      }
      setRendering(false);
    };

    performRender();
  }, [pdfDoc, currentPage, scale, isTwoPage, loading, numPages, renderPageToCanvas]);

  const goToPage = (pageNum) => {
    const target = Math.max(1, Math.min(numPages, pageNum));
    setCurrentPage(target);
    setPageInput(target.toString());
  };

  // Page Turn Actions
  const handlePrevPage = () => {
    if (isTwoPage) {
      if (currentPage <= 1) return;
      setFlipAnimation('flip-right');
      const step = currentPage === 2 || currentPage === 3 ? 1 : 2;
      goToPage(currentPage - step);
    } else {
      if (currentPage <= 1) return;
      setFlipAnimation('flip-right');
      goToPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (isTwoPage) {
      if (currentPage >= numPages) return;
      setFlipAnimation('flip-left');
      const step = currentPage === 1 ? 1 : 2;
      goToPage(currentPage + step);
    } else {
      if (currentPage >= numPages) return;
      setFlipAnimation('flip-left');
      goToPage(currentPage + 1);
    }
  };

  const handlePageJump = (e) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= numPages) {
      goToPage(pageNum);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  // Keyboard navigation & Ctrl+F search shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+F or Cmd+F -> Toggle Search Bar
      if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        setShowSearchBar(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
        return;
      }

      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, numPages, isTwoPage, searchResults, currentResultIndex]);

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const leftPageNum = isTwoPage ? (currentPage === 1 ? null : (currentPage % 2 === 0 ? currentPage : currentPage - 1)) : null;
  const rightPageNum = isTwoPage ? (currentPage === 1 ? 1 : (leftPageNum ? leftPageNum + 1 : null)) : null;

  // Check if current page has search matches
  const leftPageHasMatch = leftPageNum && searchResults.some(r => r.pageNum === leftPageNum);
  const rightPageHasMatch = rightPageNum && searchResults.some(r => r.pageNum === rightPageNum);
  const singlePageHasMatch = !isTwoPage && searchResults.some(r => r.pageNum === currentPage);

  return (
    <div 
      ref={containerRef} 
      className={`flex flex-col bg-slate-900 text-slate-100 rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 transition-all relative ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full min-h-[750px]'
      }`}
    >
      {/* Top Navigation & Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 shrink-0 z-10">
        
        {/* Title & Document Switcher */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-cyan-500 to-primary rounded-xl text-white shadow-md shadow-cyan-500/20">
            <BookOpen size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              {title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{numPages > 0 ? `${numPages} Total Pages` : 'Loading Formulary...'}</span>
              {documentList.length > 1 && (
                <select
                  onChange={(e) => onSelectDocument && onSelectDocument(e.target.value)}
                  className="bg-slate-800 text-slate-300 text-xs rounded-lg px-2 py-0.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {documentList.map((doc, idx) => (
                    <option key={idx} value={doc.path}>{doc.fileName}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Center Page Turn & Jump Controls */}
        {numPages > 0 && (
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-2xl border border-slate-700/60 shadow-inner">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={currentPage <= 1 || rendering}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white disabled:opacity-30 transition-all active:scale-95"
              title="Previous Page (Left Arrow)"
            >
              <ChevronLeft size={18} />
            </button>

            <form onSubmit={handlePageJump} className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-400">Page</span>
              <input
                type="text"
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                className="w-12 text-center bg-slate-900 border border-slate-700 rounded-lg px-1.5 py-0.5 text-white font-bold focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-slate-400">/ {numPages}</span>
            </form>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={currentPage >= numPages || rendering}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white disabled:opacity-30 transition-all active:scale-95"
              title="Next Page (Right Arrow)"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Right Tools (Search, Zoom, Mode, Upload, Fullscreen) */}
        <div className="flex items-center gap-2">
          
          {/* Full-Text Search Toggle Button */}
          <button
            type="button"
            onClick={toggleSearchBar}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              showSearchBar || searchResults.length > 0
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-sm'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Search in PDF (Ctrl + F)"
          >
            <Search size={14} />
            <span className="hidden sm:inline">Search</span>
            {searchResults.length > 0 && (
              <span className="px-1.5 py-0.2 bg-cyan-500 text-slate-950 font-bold rounded-full text-[10px]">
                {searchResults.length}
              </span>
            )}
          </button>

          {/* 2-Page / 1-Page Switcher */}
          <button
            type="button"
            onClick={() => setIsTwoPage(!isTwoPage)}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isTwoPage 
                ? 'bg-primary/20 text-primary border-primary/40' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle 2-Page Book Spread / Single Page View"
          >
            <Layers size={14} />
            {isTwoPage ? '2-Page Book' : 'Single Page'}
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-800/80 rounded-xl border border-slate-700/60 p-0.5">
            <button
              type="button"
              onClick={() => setScale(prev => Math.max(0.6, prev - 0.15))}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>
            <span className="text-[11px] font-mono font-bold px-1.5 text-slate-400">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setScale(prev => Math.min(2.5, prev + 0.15))}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={15} />
            </button>
          </div>

          {/* Download PDF */}
          {pdfUrl && (
            <a
              href={pdfUrl}
              download
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"
              title="Download PDF"
            >
              <Download size={16} />
            </a>
          )}

          {/* Upload / Change PDF Button */}
          {isAdmin && (
            <button
              type="button"
              onClick={onUploadClick}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 rounded-xl text-xs font-bold border border-cyan-500/40 transition-all shadow-sm"
              title="Upload new Magistral Preparations PDF"
            >
              <FileUp size={14} />
              <span className="hidden md:inline">Upload Book</span>
            </button>
          )}

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Book Reader'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Expandable Interactive Search Bar */}
      {showSearchBar && (
        <div className="bg-slate-900/95 backdrop-blur-md px-6 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 animate-slide-down z-20">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handlePerformSearch();
            }}
            className="flex items-center gap-2 flex-1 max-w-xl"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search formulas, medicines, compounding instructions..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5"
            >
              {isSearching ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
              Find
            </button>
          </form>

          {/* Match Navigation Controls */}
          {searchResults.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-cyan-400 font-bold bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/60">
                Match {currentResultIndex + 1} of {searchResults.length}
              </span>

              <button
                type="button"
                onClick={handlePrevSearchMatch}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700"
                title="Previous Match"
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                onClick={handleNextSearchMatch}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700"
                title="Next Match"
              >
                <ArrowDown size={14} />
              </button>

              <button
                type="button"
                onClick={() => setShowResultsDrawer(!showResultsDrawer)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold ${
                  showResultsDrawer
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <ListFilter size={13} />
                All Snippets
              </button>
            </div>
          )}

          {searchResults.length === 0 && searchQuery && !isSearching && (
            <span className="text-xs text-amber-400 italic">No matches found in this document.</span>
          )}

          <button
            type="button"
            onClick={() => {
              setShowSearchBar(false);
              setShowResultsDrawer(false);
            }}
            className="text-slate-400 hover:text-white p-1"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Search Results Drawer / Snippet Panel */}
      {showResultsDrawer && searchResults.length > 0 && (
        <div className="absolute top-[90px] right-6 z-40 w-80 sm:w-96 max-h-[420px] bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-cyan-500/30 overflow-hidden flex flex-col animate-slide-down">
          <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex justify-between items-center text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Search size={13} className="text-cyan-400" />
              Found {searchResults.length} matches for "{searchQuery}"
            </span>
            <button onClick={() => setShowResultsDrawer(false)} className="text-slate-400 hover:text-white">
              <X size={14} />
            </button>
          </div>

          <div className="overflow-y-auto p-2 divide-y divide-slate-800/60">
            {searchResults.map((res, i) => (
              <div
                key={i}
                onClick={() => handleSelectSearchResult(i)}
                className={`p-3 rounded-xl cursor-pointer transition-all text-xs flex flex-col gap-1 ${
                  currentResultIndex === i 
                    ? 'bg-cyan-950/60 text-cyan-200 border border-cyan-500/30 shadow-sm'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="flex justify-between items-center font-bold">
                  <span className="text-cyan-400 flex items-center gap-1">
                    <Bookmark size={12} /> Page {res.pageNum}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Match #{i + 1}</span>
                </div>
                <p className="text-[11px] leading-relaxed line-clamp-2 text-slate-300/90 font-serif italic">
                  {res.snippet}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Book Stage Area */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="font-bold text-base text-white">Opening Magistral Formulary...</p>
            <p className="text-xs text-slate-500 mt-1">Rendering high-resolution book pages</p>
          </div>
        ) : error || !pdfUrl ? (
          <div className="flex flex-col items-center justify-center text-center max-w-md p-8 bg-slate-800/60 rounded-3xl border border-slate-700 shadow-xl">
            <div className="p-4 bg-primary/10 text-primary rounded-2xl mb-4">
              <BookOpen size={48} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Magistral Preparations Book
            </h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              {error || "No compounding formulary PDF has been loaded yet. Upload your pharmacy's standard magistral preparations manual to view it as an open book."}
            </p>
            {isAdmin && (
              <button
                type="button"
                onClick={onUploadClick}
                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/30 transition-all active:scale-95"
              >
                <Upload size={16} /> Upload Preparation Book PDF
              </button>
            )}
          </div>
        ) : isTwoPage ? (
          /* 2-PAGE BOOK SPREAD VIEW */
          <div className="relative flex items-center justify-center max-w-full">
            
            {/* Outer Book Cover Shadow & Realistic Depth Layer */}
            <div className="relative flex items-stretch bg-stone-900 p-2 sm:p-3 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(0,0,0,0.5)] border border-stone-800">
              
              {/* LEFT PAGE CONTAINER */}
              <div className="relative flex flex-col items-end bg-stone-100 dark:bg-slate-100 rounded-l-xl overflow-hidden shadow-[-10px_0_20px_rgba(0,0,0,0.3)] border-r border-stone-300">
                {currentPage === 1 ? (
                  /* When page 1 (cover), left page is inside cover texture */
                  <div className="w-[320px] sm:w-[420px] lg:w-[480px] h-[500px] sm:h-[620px] lg:h-[680px] bg-gradient-to-r from-stone-200 to-stone-100 flex flex-col items-center justify-center p-8 text-stone-400 border-r border-stone-300">
                    <BookOpen size={40} className="text-stone-300 mb-3" />
                    <p className="text-xs font-serif uppercase tracking-widest text-stone-400">Pharmacy Formulary</p>
                    <div className="w-16 h-0.5 bg-stone-300 my-4"></div>
                    <p className="text-[11px] text-stone-400 italic text-center">Magistral Preparations & Compounding Guide</p>
                  </div>
                ) : (
                  <>
                    {/* Spine gradient shadow on left page */}
                    <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/25 via-black/5 to-transparent pointer-events-none z-10"></div>
                    <canvas ref={leftCanvasRef} className="block max-w-full h-auto" />
                    
                    {leftPageNum && (
                      <div className="absolute bottom-2 left-4 flex items-center gap-2 select-none">
                        <span className="text-[10px] font-mono text-stone-500 font-bold">
                          {leftPageNum}
                        </span>
                        {leftPageHasMatch && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-700 text-[9px] font-bold border border-cyan-500/40">
                            Search Match
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* BOOK SPINE (CENTER SEAM) */}
              <div className="w-3 sm:w-4 bg-gradient-to-r from-stone-950 via-stone-800 to-stone-950 shadow-inner relative z-20 shrink-0">
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-stone-900/80"></div>
              </div>

              {/* RIGHT PAGE CONTAINER */}
              <div className="relative flex flex-col items-start bg-stone-100 dark:bg-slate-100 rounded-r-xl overflow-hidden shadow-[10px_0_20px_rgba(0,0,0,0.3)] border-l border-stone-300">
                {/* Spine gradient shadow on right page */}
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/25 via-black/5 to-transparent pointer-events-none z-10"></div>
                <canvas ref={rightCanvasRef} className="block max-w-full h-auto" />
                
                {rightPageNum && (
                  <div className="absolute bottom-2 right-4 flex items-center gap-2 select-none">
                    {rightPageHasMatch && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-700 text-[9px] font-bold border border-cyan-500/40">
                        Search Match
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-stone-500 font-bold">
                      {rightPageNum}
                    </span>
                  </div>
                )}
              </div>

              {/* Floating Page Flip Navigation Buttons on sides */}
              {currentPage > 1 && (
                <button
                  type="button"
                  onClick={handlePrevPage}
                  className="absolute -left-5 sm:-left-6 top-1/2 -translate-y-1/2 p-3 bg-slate-900/90 hover:bg-primary text-white rounded-full shadow-2xl border border-slate-700 transition-all hover:scale-110 active:scale-95 z-30"
                  title="Previous Spread"
                >
                  <ChevronLeft size={22} />
                </button>
              )}

              {currentPage < numPages && (
                <button
                  type="button"
                  onClick={handleNextPage}
                  className="absolute -right-5 sm:-right-6 top-1/2 -translate-y-1/2 p-3 bg-slate-900/90 hover:bg-primary text-white rounded-full shadow-2xl border border-slate-700 transition-all hover:scale-110 active:scale-95 z-30"
                  title="Next Spread"
                >
                  <ChevronRight size={22} />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* SINGLE PAGE CONTINUOUS VIEW */
          <div className="relative flex items-center justify-center max-w-full">
            <div className="relative bg-white dark:bg-slate-100 p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-slate-700 overflow-hidden">
              <canvas ref={singleCanvasRef} className="block max-w-full h-auto rounded-lg" />
              
              <div className="absolute bottom-3 right-4 flex items-center gap-2">
                {singlePageHasMatch && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-700 text-[10px] font-bold border border-cyan-500/40">
                    Search Match
                  </span>
                )}
                <span className="text-xs font-mono text-stone-600 font-bold bg-stone-200/80 px-2 py-0.5 rounded shadow-sm">
                  Page {currentPage} / {numPages}
                </span>
              </div>

              {currentPage > 1 && (
                <button
                  type="button"
                  onClick={handlePrevPage}
                  className="absolute -left-4 sm:-left-5 top-1/2 -translate-y-1/2 p-2.5 bg-slate-900/90 hover:bg-primary text-white rounded-full shadow-2xl border border-slate-700 transition-all hover:scale-110 active:scale-95 z-30"
                >
                  <ChevronLeft size={20} />
                </button>
              )}

              {currentPage < numPages && (
                <button
                  type="button"
                  onClick={handleNextPage}
                  className="absolute -right-4 sm:-right-5 top-1/2 -translate-y-1/2 p-2.5 bg-slate-900/90 hover:bg-primary text-white rounded-full shadow-2xl border border-slate-700 transition-all hover:scale-110 active:scale-95 z-30"
                >
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Page Navigation Trackbar */}
      {numPages > 1 && (
        <div className="px-6 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center gap-4 text-xs text-slate-400 shrink-0">
          <span className="font-mono text-[11px]">Cover</span>
          <input
            type="range"
            min="1"
            max={numPages}
            value={currentPage}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              goToPage(val);
            }}
            className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <span className="font-mono text-[11px]">End (p.{numPages})</span>
        </div>
      )}
    </div>
  );
};

export default PdfBookReader;
