import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Heart, Phone, ChevronDown, X, Music, PauseCircle, PlayCircle, ChevronRight, ChevronLeft, MapPin, Clock, Car, SkipBack, SkipForward, Pause, Play } from 'lucide-react';
import { LightboxPortal } from './shared/LightboxPortal';


// 음악 컨트롤러 컴포넌트
const MusicController = forwardRef((_props: any, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const play = () => {
    if (!audio) {
      const newAudio = new Audio('/wedding-song.mp3');
      newAudio.loop = true;
      newAudio.volume = 0.3;
      newAudio.play().then(() => {
        setIsPlaying(true);
        setAudio(newAudio);
      }).catch(() => {
        alert('음악 재생이 차단되었습니다.');
      });
      newAudio.addEventListener('loadedmetadata', () => {
        setDuration(newAudio.duration);
      });

      newAudio.addEventListener('timeupdate', () => {
        setCurrentTime(newAudio.currentTime);
        const prog = (newAudio.currentTime / newAudio.duration) * 100;
        setProgress(prog);
      });
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  useImperativeHandle(ref, () => ({
    play,
    pause,
    isPlaying,
    toggleMusic: () => {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    },
    progress,  // 추가
    currentTime,  // 추가
    duration  // 추가
  }));

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio]);

  const toggleMusic = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return (
    <button
      onClick={toggleMusic}
      className="fixed bottom-6 right-6 z-50 bg-white/90 backdrop-blur-md shadow-lg rounded-full p-3.5 hover:shadow-xl transition-all duration-300"
      aria-label={isPlaying ? '음악 일시정지' : '음악 재생'}
    >
      {isPlaying ? (
        <PauseCircle className="w-5 h-5 text-rose-400" />
      ) : (
        <PlayCircle className="w-5 h-5 text-rose-400" />
      )}
    </button>
  );
});

// 메인 히어로 섹션 - 리디자인
const HeroSection = ({ musicControllerRef }: { musicControllerRef: any }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);


  // musicControllerRef의 상태 변화를 감지
  useEffect(() => {
    const checkPlayingState = setInterval(() => {
      if (musicControllerRef.current) {
        setIsPlaying(musicControllerRef.current.isPlaying);
        setProgress(musicControllerRef.current.progress || 0);

      }
    }, 100);

    return () => clearInterval(checkPlayingState);
  }, [musicControllerRef]);

  return (
    <section className="relative h-screen flex flex-col overflow-hidden bg-gradient-to-br from-rose-50 via-white to-rose-50">
      {/* 상단 타이틀 */}
      <div className="absolute top-12 left-0 right-0 text-center z-20">
        <h2 className="text-rose-400 text-lg font-light tracking-[0.3em] opacity-80">Wedding Player</h2>
      </div>

      {/* 중앙 콘텐츠 */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className={`relative w-full max-w-sm transition-all duration-1500 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* 메인 이미지 카드 */}
          <div className="relative bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden">
            <div className="aspect-[3/4] relative">
              <img
                src="./images/013.jpg"
                alt="Wedding"
                className="w-full h-full object-cover object-[60%] scale-110"
                onLoad={() => setImageLoaded(true)}
              />
              {/* 그라데이션 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>

            {/* 하단 정보 */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-light mb-2">
                    봉구 <span className="text-red-400 mx-2">♥</span> 수정
                  </h1>
                  <p className="text-white/80 text-sm">2025.12.13 SAT PM 12:40</p>
                  <p className="text-white/80 text-sm">웨딩시그니처 4층 아너스홀</p>
                </div>
              </div>
            </div>
          </div>

          {/* 뮤직 플레이어 UI */}
          <div className="mt-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-800 font-medium">Our Wedding Day</p>
                <p className="text-gray-500 text-xs">BONGGU, SOOJUNG</p>
              </div>
            </div>

            {/* 프로그레스 바 */}
            <div className="relative h-1 bg-gray-200 rounded-full mb-4 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* 컨트롤 버튼 */}
            <div className="flex items-center justify-center gap-6">
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={() => musicControllerRef.current?.toggleMusic()}
                className="w-14 h-14 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white ml-0.5" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-0.5" />
                )}
              </button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 스크롤 인디케이터 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <ChevronDown className="w-5 h-5 text-rose-300 animate-bounce" />
      </div>
    </section>
  );
};

// 인사말 섹션 - 색상 테마 적용
const GreetingSection = () => {
  return (
    <section className="py-24 px-8 bg-white">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl font-light tracking-wider mb-12 text-gray-800">초대합니다</h2>
        <div className="text-gray-600 leading-loose space-y-8 font-light">
          <p>
            꽃피는 봄에 맺은 인연이<br />
            찬란한 계절을 지나<br />
            이제 눈내리는 겨울<br />
            한 가정을 이루려 합니다<br />
            소박하지만 따듯한 시작에<br />
            함께해 주시면 감사하겠습니다<br />
            키우고자 합니다.
          </p>
        </div>

        <div className="mt-16 space-y-6 text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-3">
            <span>이성화 · 김종희</span>
            <span className="text-xs">의 차남</span>
            <span className="font-medium text-gray-700">봉구</span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <span>김강준 · 유신자</span>
            <span className="text-xs">의 차녀</span>
            <span className="font-medium text-gray-700">수정</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// 갤러리 섹션 - 최적화 버전
const GallerySection = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());

  const images = [
    "./images/025.jpg",
    "./images/024.jpg",
    "./images/023.jpg",
    "./images/022.jpg",
    "./images/019.jpg",
    "./images/018.jpg",
    "./images/017.jpg",
    "./images/015.jpg",
    "./images/014.jpg",
  ];

  // 이미지 프리로드 함수
  const preloadImage = (index: number) => {
    if (!loadedImages.has(index) && !imageLoadErrors.has(index)) {
      const img = new Image();
      img.src = images[index];
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(index));
      };
      img.onerror = () => {
        setImageLoadErrors(prev => new Set(prev).add(index));
      };
    }
  };

  // 선택된 이미지와 인접 이미지 미리 로드
  useEffect(() => {
    if (selectedImageIndex !== null) {
      // 현재 이미지
      preloadImage(selectedImageIndex);
      // 이전 이미지
      if (selectedImageIndex > 0) {
        preloadImage(selectedImageIndex - 1);
      }
      // 다음 이미지
      if (selectedImageIndex < images.length - 1) {
        preloadImage(selectedImageIndex + 1);
      }
    }
  }, [selectedImageIndex]);

  // 초기 뷰포트에 보이는 이미지들 로드
  useEffect(() => {
    // 처음 6개 이미지 프리로드
    for (let i = 0; i < Math.min(6, images.length); i++) {
      preloadImage(i);
    }
  }, []);

  // 키보드 핸들러
  useEffect(() => {
    if (selectedImageIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex]);

  const goToPrevious = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex(selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1);
  };

  const goToNext = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex(selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1);
  };

  // 터치 스와이프 핸들러
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  return (
    <section className="py-24 bg-neutral-50">
      <div className="max-w-md mx-auto px-8">
        <h2 className="text-2xl font-light tracking-wider text-center mb-12 text-gray-800">갤러리</h2>
        <div className="grid grid-cols-3 gap-2">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="aspect-square overflow-hidden rounded-lg cursor-pointer transform transition-all hover:scale-105 hover:shadow-lg bg-gray-100 relative"
              onClick={() => setSelectedImageIndex(idx)}
            >
              {/* 로딩 플레이스홀더 */}
              {!loadedImages.has(idx) && !imageLoadErrors.has(idx) && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}

              <img
                src={img}
                alt={`Gallery ${idx + 1}`}
                className={`w-full h-full object-cover transition-opacity duration-300 ${loadedImages.has(idx) ? 'opacity-100' : 'opacity-0'
                  }`}
                loading="lazy"
                onLoad={() => setLoadedImages(prev => new Set(prev).add(idx))}
                onError={() => setImageLoadErrors(prev => new Set(prev).add(idx))}
              />

              {/* 에러 상태 */}
              {imageLoadErrors.has(idx) && (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">이미지 로드 실패</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedImageIndex !== null && (
        <LightboxPortal>
          <div
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
            style={{ width: '100vw', height: '100vh', left: 0, top: 0 }}
            onClick={() => setSelectedImageIndex(null)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <button
              className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-10"
              onClick={e => {
                e.stopPropagation();
                setSelectedImageIndex(null);
              }}
              aria-label="닫기"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white z-10"
              onClick={e => {
                e.stopPropagation();
                goToPrevious();
              }}
              aria-label="이전"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white z-10"
              onClick={e => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="다음"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* 로딩 인디케이터 */}
            {!loadedImages.has(selectedImageIndex) && !imageLoadErrors.has(selectedImageIndex) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}

            <img
              src={images[selectedImageIndex]}
              alt={`Selected ${selectedImageIndex + 1}`}
              className={`max-w-full max-h-full object-contain select-none pointer-events-auto transition-opacity duration-300 ${loadedImages.has(selectedImageIndex) ? 'opacity-100' : 'opacity-0'
                }`}
              draggable={false}
              style={{ maxWidth: '100vw', maxHeight: '100vh' }}
              onClick={e => e.stopPropagation()}
            />

            {/* 에러 상태 */}
            {imageLoadErrors.has(selectedImageIndex) && (
              <div className="text-white text-center">
                <p>이미지를 불러올 수 없습니다</p>
                <button
                  className="mt-2 text-sm underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageLoadErrors(prev => {
                      const newSet = new Set(prev);
                      newSet.delete(selectedImageIndex);
                      return newSet;
                    });
                    preloadImage(selectedImageIndex);
                  }}
                >
                  다시 시도
                </button>
              </div>
            )}

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5" onClick={e => e.stopPropagation()}>
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === selectedImageIndex
                    ? 'bg-white w-8'
                    : 'bg-white/40 hover:bg-white/60'
                    }`}
                />
              ))}
            </div>
            <div className="absolute top-6 left-6 text-white/80 bg-black/30 px-3 py-1 rounded-full text-sm" onClick={e => e.stopPropagation()}>
              {selectedImageIndex + 1} / {images.length}
            </div>
          </div>
        </LightboxPortal>
      )}
    </section>
  );
};

// 캘린더 섹션 - 색상 테마 적용
const CalendarSection = () => {
  const weddingDate = new Date(2025, 11, 13); // 12월 13일
  const getDaysUntilWedding = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weddingDateCopy = new Date(weddingDate);
    weddingDateCopy.setHours(0, 0, 0, 0);
    const diff = weddingDateCopy.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-md mx-auto px-8 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-rose-400 mb-8">
          <Clock className="w-4 h-4" />
          <span>{getDaysUntilWedding() > 0 ? `D-${getDaysUntilWedding()}` : 'D-Day'}</span>
        </div>

        <div className="space-y-3">
          <h3 className="text-3xl font-light text-gray-800">12월 13일</h3>
          <p className="text-gray-600">토요일 오후 12시 40분</p>
          <p className="text-sm text-gray-500">2025년</p>
        </div>
      </div>
    </section>
  );
};

// 위치 섹션 - 색상 테마 적용
const LocationSection = () => {
  const [copiedAddress, setCopiedAddress] = useState(false);

  const address = "서울시 마포구 양화로 87";

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };
  return (
    <section className="py-24 bg-neutral-50">
      <div className="max-w-md mx-auto px-8">
        <h2 className="text-2xl font-light tracking-wider text-center mb-12 text-gray-800">오시는 길</h2>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="text-center mb-8">
            <h3 className="text-xl mb-3 text-gray-800">웨딩시그니처</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              서울시 마포구 양화로 87<br />
              웨딩시그니처 4층 아너스홀
            </p>
            <button
              onClick={copyAddress}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
            >
              <MapPin className="w-4 h-4" />
              {copiedAddress ? '복사됨!' : '주소 복사'}
            </button>
          </div>
          <div className="aspect-[4/3] bg-gray-100 rounded-xl mb-6 overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src="https://t1.daumcdn.net/roughmap/imgmap/563c4e06f503c5e78fa4a0720f7941a38f0a7e51baa457c1ab2d3ad9cb9ec134"
              alt="웨딩시그니처 위치"
            />
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-gray-600">
                <p>
                  <span className="font-medium text-gray-700">합정역</span>
                  <span className="text-xs ml-1">(2, 6호선)</span>
                  <br />
                  <span className="text-xs">2번 출구 도보 4분</span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">홍대입구역</span>
                  <span className="text-xs ml-1">(2호선, 공항철도)</span>
                  <br />
                  <span className="text-xs">1번 출구 도보 11분</span>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Car className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1 text-gray-600">
                <p>
                  <span className="font-medium text-gray-700">주차 2시간 무료</span>
                  <span className="text-xs ml-1">(웨딩홀 주차장)</span>
                </p>
                <ul className="ml-1 list-disc list-inside text-xs text-gray-700">
                  <li>제1주차장: 본 건물</li>
                  <li>제2주차장: H스퀘어</li>
                  <li>제3주차장: 서교빌딩</li>
                </ul>
                <p className="text-xs text-gray-500 pt-2">
                  ※ 당일 모든 주차는 <span className="font-semibold">주차 요원 안내</span>를 받아주세요.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              예식 당일 주차장이 혼잡할 수 있으니<br />
              가급적 대중교통 이용을 권장드립니다.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <a
            href="https://naver.me/xFLuQhhM"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-green-500 text-white py-3.5 rounded-xl font-medium hover:bg-green-600 transition-colors text-center text-sm"
          >
            네이버 지도
          </a>
          <a
            href="https://kko.kakao.com/UYLNMIMBsX"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-yellow-400 text-gray-800 py-3.5 rounded-xl font-medium hover:bg-yellow-500 transition-colors text-center text-sm"
          >
            카카오맵
          </a>
        </div>
      </div>
    </section>
  );
};

// 연락처 섹션 - 색상 테마 적용
const ContactSection = () => {
  const contacts = [
    { role: '신랑', name: '이봉구', phone: '010-5031-6317' },
    { role: '신부', name: '이수정', phone: '010-9905-9256' },
    { role: '신랑 아버지', name: '이성화', phone: '010-2701-6325' },
    { role: '신랑 어머니', name: '김종희', phone: '010-7925-6325' },
    { role: '신부 아버지', name: '이강준', phone: '010-5555-6666' },
    { role: '신부 어머니', name: '유신자', phone: '010-7777-8888' }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-md mx-auto px-8">
        <h2 className="text-2xl font-light tracking-wider text-center mb-12 text-gray-800">연락처</h2>

        <div className="grid grid-cols-2 gap-4">
          {contacts.map((contact, idx) => (
            <a
              key={idx}
              href={`tel:${contact.phone}`}
              className="group p-6 text-center hover:bg-neutral-50 rounded-xl transition-colors"
            >
              <p className="text-xs text-gray-500 mb-1">{contact.role}</p>
              <p className="font-medium text-gray-800 mb-3">{contact.name}</p>
              <div className="inline-flex items-center justify-center w-10 h-10 bg-rose-50 group-hover:bg-rose-100 rounded-full transition-colors">
                <Phone className="w-4 h-4 text-rose-400" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

// 마음 전하기 섹션 - 색상 테마 적용
const AccountSection = () => {
  const [showAccount, setShowAccount] = useState({ groom: false, bride: false });
  const [copiedAccount, setCopiedAccount] = useState('');

  const copyToClipboard = (text: string, accountId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(accountId);
    setTimeout(() => setCopiedAccount(''), 2000);
  };

  const 신랑계좌번호 = '645502-01-294223';
  const 신랑아버지계좌번호 = ''
  const 신랑어머니계좌번호 = '';
  const 신부계좌번호 = '111-222-333444';
  const 신부아버지계좌번호 = '';
  const 신부어머니계좌번호 = '';


  return (
    <section className="py-24 bg-neutral-50">
      <div className="max-w-md mx-auto px-8">
        <h2 className="text-2xl font-light tracking-wider text-center mb-12 text-gray-800">마음 전하기</h2>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <p className="text-center text-gray-600 mb-8 font-light">
            참석이 어려우신 분들을 위해<br />
            계좌번호를 남겨드립니다.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => setShowAccount({ ...showAccount, groom: !showAccount.groom })}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 rounded-xl transition-colors"
            >
              <span className="text-gray-700">신랑측 계좌번호</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showAccount.groom ? 'rotate-180' : ''}`} />
            </button>

            {showAccount.groom && (
              <div className="px-4 pb-4 space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="text-sm">
                    <p className="text-gray-500 text-xs">신랑 이봉구</p>
                    <p className="text-gray-700">국민은행 {신랑계좌번호}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(신랑계좌번호, 'groom1')}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copiedAccount === 'groom1' ? '복사됨' : '복사'}
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="text-sm">
                    <p className="text-gray-500 text-xs">신랑 아버지 이성화</p>
                    <p className="text-gray-700">국민은행 {신랑아버지계좌번호}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(신랑아버지계좌번호, 'groom2')}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copiedAccount === 'groom2' ? '복사됨' : '복사'}
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="text-sm">
                    <p className="text-gray-500 text-xs">신랑 어머니 김종희</p>
                    <p className="text-gray-700">국민은행 {신랑어머니계좌번호}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(신랑어머니계좌번호, 'groom3')}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copiedAccount === 'groom3' ? '복사됨' : '복사'}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowAccount({ ...showAccount, bride: !showAccount.bride })}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 rounded-xl transition-colors"
            >
              <span className="text-gray-700">신부측 계좌번호</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showAccount.bride ? 'rotate-180' : ''}`} />
            </button>

            {showAccount.bride && (
              <div className="px-4 pb-4 space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="text-sm">
                    <p className="text-gray-500 text-xs">신부 이수정</p>
                    <p className="text-gray-700">우리은행 {신부계좌번호}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(신부계좌번호, 'bride1')}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copiedAccount === 'bride1' ? '복사됨' : '복사'}
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="text-sm">
                    <p className="text-gray-500 text-xs">신부 아버지 이강준</p>
                    <p className="text-gray-700">우리은행 {신부아버지계좌번호}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(신부아버지계좌번호, 'bride2')}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copiedAccount === 'bride2' ? '복사됨' : '복사'}
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="text-sm">
                    <p className="text-gray-500 text-xs">신부 어머니 유신자</p>
                    <p className="text-gray-700">우리은행 {신부어머니계좌번호}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(신부어머니계좌번호, 'bride3')}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copiedAccount === 'bride3' ? '복사됨' : '복사'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// 안내사항 - 색상 테마 적용
const NoticeSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-md mx-auto px-8">
        <h2 className="text-2xl font-light tracking-wider text-center mb-12 text-gray-800">안내사항</h2>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-2xl p-6 flex gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🅿️</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 mb-2">주차안내</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                예식 당일 주차 혼잡이 예상됩니다.<br />
                가급적 대중교통 이용을 부탁 드립니다.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                · 지정 주차장 2시간 무료<br />
                · 건물 정문에서 안내 받으세요
              </p>
            </div>
          </div>

          <div className="bg-rose-50 rounded-2xl p-6 flex gap-4">
            <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💐</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 mb-2">화환안내</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                화환은 정중히 사양합니다.<br />
                축하해 주시는 마음만 감사히 받겠습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 푸터 - 색상 테마 적용
const FooterSection = () => {
  return (
    <footer className="py-16 bg-rose-50">
      <div className="text-center">
        <Heart className="w-6 h-6 mx-auto mb-4 text-rose-300" />
        <p className="text-gray-600 text-sm font-light">
          봉구 & 수정
        </p>
        <p className="text-gray-400 text-xs mt-2">
          2025.12.13
        </p>
      </div>
    </footer>
  );
};

// 메인 앱
export default function WeddingInvitation() {
  const [showMusicPrompt, setShowMusicPrompt] = useState(true);
  const musicControllerRef = useRef<any>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('section');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-lg mx-auto bg-white">
        <style>{`
        @import url('//fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500&display=swap');
        @import url('//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css');
  
        * {
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        }
        
        h1, h2, h3 {
          font-family: 'Noto Serif KR', serif;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
          
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>

        {showMusicPrompt && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
              <div className="text-center">
                <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-6 h-6 text-rose-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">배경음악</h3>
                <p className="text-sm text-gray-600 mb-6">
                  청첩장과 함께 음악을 들으시겠습니까?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowMusicPrompt(false);
                      if (musicControllerRef.current) {
                        musicControllerRef.current.play();
                      }
                    }}
                    className="flex-1 bg-rose-400 text-white py-2.5 px-4 rounded-xl hover:bg-rose-500 transition-colors"
                  >
                    재생
                  </button>
                  <button
                    onClick={() => setShowMusicPrompt(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <MusicController ref={musicControllerRef} />
        <HeroSection musicControllerRef={musicControllerRef} />
        <GreetingSection />
        <GallerySection />
        <CalendarSection />
        <LocationSection />
        <ContactSection />
        <AccountSection />
        <NoticeSection />
        <FooterSection />
      </div>
    </div>
  );
}