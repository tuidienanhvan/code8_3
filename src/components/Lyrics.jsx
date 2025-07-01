import React, { useEffect, useState, useRef } from 'react';
import './Lyrics.css';

const Lyrics = ({ audioRef, isPlaying }) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(-1);
    const [visibleLines, setVisibleLines] = useState([]);
    const lyricsContainerRef = useRef(null);

  // Hàm chuyển đổi thời gian CapCut (00:00:00:00) sang mili giây
  const parseCapcutTime = (timeString, fps = 60) => {
    const [hh, mm, ss, ff] = timeString.split(":").map(Number);
    return ((hh * 3600 + mm * 60 + ss) * 1000) + Math.round((ff / fps) * 1000);
  };

  // Full lyrics data với định dạng thời gian CapCut
  const lyricsData = [
    // Dòng 1
    { time: "00:00:00:41", text: "Mỗi" },
    { time: "00:00:00:57", text: "khi" },
    { time: "00:00:01:14", text: "cạnh" },
    { time: "00:00:01:32", text: "bên" },
    { time: "00:00:01:50", text: "anh" },
    { time: "00:00:02:06", text: "Em" },
    { time: "00:00:02:24", text: "không" },
    { time: "00:00:02:41", text: "cần" },
    { time: "00:00:02:59", text: "che" },
    { time: "00:00:03:16", text: "giấu" },
    { time: "00:00:03:35", text: "đi" },
    { time: "00:00:03:53", text: "ước" },
    { time: "00:00:04:08", text: "mơ" },
    
    // Dòng 2
    { time: "00:00:04:56", text: "Cứ" },
    { time: "00:00:05:14", text: "nói" },
    { time: "00:00:05:30", text: "đi," },
    { time: "00:00:05:50", text: "đừng" },
    { time: "00:00:06:03", text: "suy" },
    { time: "00:00:06:23", text: "nghĩ" },
    { time: "00:00:06:51", text: "Điều" },
    { time: "00:00:07:13", text: "em" },
    { time: "00:00:07:28", text: "muốn" },
    { time: "00:00:07:47", text: "là" },
    { time: "00:00:08:07", text: "điều" },
    { time: "00:00:08:20", text: "anh" },
    { time: "00:00:08:36", text: "mong" },
    
    // Dòng 3
    { time: "00:00:09:46", text: "Đến" },
    { time: "00:00:09:58", text: "bao" },
    { time: "00:00:10:18", text: "giờ" },
    { time: "00:00:10:35", text: "mặt" },
    { time: "00:00:10:52", text: "trời" },
    { time: "00:00:11:10", text: "mỗi" },
    { time: "00:00:11:26", text: "sáng" },
    { time: "00:00:11:40", text: "Chẳng" },
    { time: "00:00:11:59", text: "còn" },
    { time: "00:00:12:15", text: "chiếu" },
    { time: "00:00:12:34", text: "soi" },
    { time: "00:00:12:51", text: "nơi" },
    { time: "00:00:13:08", text: "đây" },
    
    // Dòng 4
    { time: "00:00:14:04", text: "Thì" },
    { time: "00:00:14:18", text: "cũng" },
    { time: "00:00:14:33", text: "mặc" },
    { time: "00:00:14:49", text: "kệ" },
    { time: "00:00:15:09", text: "đi" },
    { time: "00:00:15:23", text: "chớ" },
    { time: "00:00:15:59", text: "Điều" },
    { time: "00:00:16:17", text: "anh" },
    { time: "00:00:16:36", text: "muốn" },
    { time: "00:00:16:52", text: "là" },
    { time: "00:00:17:07", text: "làm" },
    { time: "00:00:17:24", text: "em" },
    { time: "00:00:17:46", text: "vui" },
    
    // Dòng 5
    { time: "00:00:18:49", text: "Bởi" },
    { time: "00:00:18:56", text: "vì" },
    { time: "00:00:19:03", text: "anh" },
    { time: "00:00:19:12", text: "đã" },
    { time: "00:00:19:20", text: "yêu" },
    { time: "00:00:19:37", text: "đôi" },
    { time: "00:00:19:56", text: "mắt" },
    { time: "00:00:20:18", text: "em" },
    { time: "00:00:20:26", text: "say" },
    { time: "00:00:20:50", text: "thật" },
    { time: "00:00:21:07", text: "say" },
    { time: "00:00:21:38", text: "Yêu" },
    { time: "00:00:21:58", text: "từ" },
    { time: "00:00:22:11", text: "lúc" },
    { time: "00:00:22:30", text: "mình" },
    { time: "00:00:22:48", text: "tay" },
    { time: "00:00:23:09", text: "cầm" },
    { time: "00:00:23:23", text: "tay" },
    
    // Dòng 6
    { time: "00:00:23:52", text: "Yêu" },
    { time: "00:00:24:14", text: "nụ" },
    { time: "00:00:24:27", text: "hôn" },
    { time: "00:00:24:44", text: "ngọt" },
    { time: "00:00:25:01", text: "hơn" },
    { time: "00:00:25:19", text: "trời" },
    { time: "00:00:25:36", text: "mây" },
    { time: "00:00:26:07", text: "Quên" },
    { time: "00:00:26:28", text: "hết" },
    { time: "00:00:26:44", text: "đi" },
    { time: "00:00:27:01", text: "bao" },
    { time: "00:00:27:16", text: "đêm" },
    { time: "00:00:27:52", text: "ngày" },
    
    // Dòng 7
    { time: "00:00:28:24", text: "Ánh" },
    { time: "00:00:28:43", text: "trăng" },
    { time: "00:00:29:03", text: "dẫn" },
    { time: "00:00:29:18", text: "ta" },
    { time: "00:00:29:34", text: "tới" },
    { time: "00:00:29:51", text: "muôn" },
    { time: "00:00:30:05", text: "lối" },
    { time: "00:00:30:40", text: "Đưa" },
    { time: "00:00:30:54", text: "vầng" },
    { time: "00:00:31:14", text: "dương" },
    { time: "00:00:31:36", text: "cùng" },
    { time: "00:00:31:46", text: "em" },
    { time: "00:00:32:07", text: "dạo" },
    { time: "00:00:32:19", text: "chơi" },
    
    // Dòng 8
    { time: "00:00:32:53", text: "Sông" },
    { time: "00:00:33:05", text: "thời" },
    { time: "00:00:33:29", text: "gian" },
    { time: "00:00:33:44", text: "dần" },
    { time: "00:00:34:02", text: "trôi" },
    { time: "00:00:34:22", text: "chậm" },
    { time: "00:00:34:43", text: "trôi" },
    { time: "00:00:35:13", text: "Vẫn" },
    { time: "00:00:35:31", text: "cứ" },
    { time: "00:00:35:49", text: "bên" },
    { time: "00:00:36:04", text: "nhau" },
    { time: "00:00:36:25", text: "như" },
    { time: "00:00:36:54", text: "vậy" },
    
    // Dòng 9
    { time: "00:00:37:11", text: "Đi" },
    { time: "00:00:37:27", text: "qua" },
    { time: "00:00:37:44", text: "vùng" },
    { time: "00:00:38:03", text: "đất" },
    { time: "00:00:38:22", text: "ta" },
    { time: "00:00:38:35", text: "chưa" },
    { time: "00:00:38:53", text: "đặt" },
    { time: "00:00:39:11", text: "tên" },
    { time: "00:00:39:42", text: "Ngắm" },
    { time: "00:00:39:59", text: "khoảnh" },
    { time: "00:00:40:16", text: "khắc" },
    { time: "00:00:40:34", text: "ban" },
    { time: "00:00:40:53", text: "mai" },
    { time: "00:00:41:06", text: "vừa" },
    { time: "00:00:41:30", text: "lên" },
    
    // Dòng 10
    { time: "00:00:42:00", text: "Con" },
    { time: "00:00:42:16", text: "đường" },
    { time: "00:00:42:30", text: "sát" },
    { time: "00:00:42:52", text: "bên" },
    { time: "00:00:43:13", text: "khu" },
    { time: "00:00:43:27", text: "rừng" },
    { time: "00:00:43:43", text: "Vượt" },
    { time: "00:00:44:01", text: "qua" },
    { time: "00:00:44:17", text: "hết" },
    { time: "00:00:44:38", text: "núi" },
    { time: "00:00:44:51", text: "cao" },
    { time: "00:00:45:08", text: "đến" },
    { time: "00:00:45:23", text: "nơi" },
    { time: "00:00:45:42", text: "lâu" },
    { time: "00:00:46:00", text: "đài" },
    
    // Dòng 11
    { time: "00:00:46:31", text: "Ta" },
    { time: "00:00:46:47", text: "lại" },
    { time: "00:00:47:04", text: "hát" },
    { time: "00:00:47:23", text: "thêm" },
    { time: "00:00:47:41", text: "bao" },
    { time: "00:00:47:59", text: "bài" },
    { time: "00:00:48:18", text: "ca" },
    { time: "00:00:48:47", text: "Tay" },
    { time: "00:00:49:00", text: "nàng" },
    { time: "00:00:49:16", text: "dắt" },
    { time: "00:00:49:40", text: "theo" },
    { time: "00:00:49:55", text: "muôn" },
    { time: "00:00:50:07", text: "loài" },
    { time: "00:00:50:29", text: "hoa" },
    
    // Dòng 12
    { time: "00:00:51:02", text: "Trong" },
    { time: "00:00:51:20", text: "từng" },
    { time: "00:00:51:36", text: "phút" },
    { time: "00:00:51:50", text: "giây" },
    { time: "00:00:52:08", text: "thiên" },
    { time: "00:00:52:29", text: "đàng," },
    { time: "00:00:52:49", text: "em" },
    { time: "00:00:53:01", text: "à," },
    { time: "00:00:53:18", text: "có" },
    { time: "00:00:53:53", text: "hay?" },
    { time: "00:00:54:44", text: "Ná-na-na-nà" }
  ].map(item => ({
    ...item,
    timeMs: parseCapcutTime(item.time)
  }));

  // Nhóm các từ thành dòng
const lines = [
    // Dòng 1 (chia làm 2)
    [0, 4],     // "Mỗi khi cạnh bên anh, em không cần"
    [5, 12],    // "che giấu đi ước mơ"
    
    // Dòng 2 (chia làm 2)
    [13, 18],   // "Cứ nói đi, đừng suy nghĩ, điều em"
    [19, 25],   // "muốn là điều anh mong"
    
    // Dòng 3 (chia làm 2)
    [26, 32],   // "Đến bao giờ mặt trời mỗi sáng"
    [33, 38],   // "chẳng còn chiếu soi nơi đây"
    
    // Dòng 4 (chia làm 2)
    [39, 44],   // "Thì cũng mặc kệ đi chớ, điều"
    [45, 51],   // "anh muốn là làm em vui"
    
    // Dòng 5 (chia làm 3 phần do quá dài)
    [52, 62],   // "Bởi vì anh đã yêu đôi mắt em"
    [63, 69],   // "say thật say, yêu từ lúc mình tay cầm tay"
    
    // Dòng 6 (chia làm 2)
    [70, 76],   // "Yêu nụ hôn ngọt hơn trời mây,"
    [77, 82],   // "quên hết đi bao đêm ngày"
    
    // Dòng 7 (chia làm 2)
    [83, 89],   // "Ánh trăng dẫn ta tới muôn lối,"
    [90, 96],   // "đưa vầng dương cùng em dạo chơi"
    
    // Dòng 8 (chia làm 2)
    [97, 103],  // "Sông thời gian dần trôi chậm trôi,"
    [104, 109], // "vẫn cứ bên nhau như vậy"
    
    // Dòng 9 (chia làm 2)
    [110, 117], // "Đi qua vùng đất ta chưa đặt tên,"
    [118, 124], // "ngắm khoảnh khắc ban mai vừa lên"
    
    // Dòng 10 (chia làm 2)
    [125, 130], // "Con đường sát bên khu rừng, vượt qua"
    [131, 139], // "hết núi cao đến nơi lâu đài"
    
    // Dòng 11 (chia làm 2)
    [140, 146], // "Ta lại hát thêm bao bài ca,"
    [147, 153], // "tay nàng dắt theo muôn loài hoa"
    
    // Dòng 12 (giữ nguyên do đã ngắn)
    [154, 163], // "Trong từng phút giây thiên đàng, em à, có hay?"
    
    // Dòng 13 (giữ nguyên)
    [164, 166]  // "Ná-na-na-nà"
];

  useEffect(() => {
        // Khởi tạo visibleLines với 3 dòng (dòng đầu tiên ở giữa)
        setVisibleLines([
            [-1, -1], // Dòng trống
            lines[0],  // Dòng đầu tiên
            lines[1]   // Dòng tiếp theo
        ]);
    }, []);

    useEffect(() => {
        if (!audioRef.current || !isPlaying) return;

        const updateLyrics = () => {
            const currentTimeMs = audioRef.current.currentTime * 1000;
            
            let newIndex = -1;
            for (let i = 0; i < lyricsData.length; i++) {
                if (currentTimeMs >= lyricsData[i].timeMs) {
                    newIndex = i;
                } else {
                    break;
                }
            }

            if (newIndex !== currentWordIndex) {
                setCurrentWordIndex(newIndex);
            }

            requestAnimationFrame(updateLyrics);
        };

        const animationId = requestAnimationFrame(updateLyrics);
        return () => cancelAnimationFrame(animationId);
    }, [audioRef, isPlaying, currentWordIndex]);

    // Xác định dòng hiện tại và các dòng xung quanh
    useEffect(() => {
        if (currentWordIndex === -1) return;

        // Tìm dòng hiện tại chứa từ đang phát
        let currentLineIndex = -1;
        for (let i = 0; i < lines.length; i++) {
            const [start, end] = lines[i];
            if (currentWordIndex >= start && currentWordIndex <= end) {
                currentLineIndex = i;
                break;
            }
        }

        if (currentLineIndex === -1) return;

        // Xác định các dòng cần hiển thị (luôn có 3 dòng)
        let prevLine, currentLine, nextLine;

        // Xử lý dòng đầu tiên
        if (currentLineIndex === 0) {
            prevLine = [-1, -1]; // Dòng trống
            currentLine = lines[currentLineIndex];
            nextLine = lines[currentLineIndex + 1];
        } 
        // Xử lý dòng cuối cùng
        else if (currentLineIndex === lines.length - 1) {
            prevLine = lines[currentLineIndex - 1];
            currentLine = lines[currentLineIndex];
            nextLine = [-1, -1]; // Dòng trống
        }
        // Các dòng ở giữa
        else {
            prevLine = lines[currentLineIndex - 1];
            currentLine = lines[currentLineIndex];
            nextLine = lines[currentLineIndex + 1];
        }

        setVisibleLines([prevLine, currentLine, nextLine]);
    }, [currentWordIndex]);

    return (
        <div className="lyrics-container" ref={lyricsContainerRef}>
            <div className="lyrics-content">
                {Array.from({ length: 3 }).map((_, index) => {
                    const line = visibleLines[index] || [-1, -1];
                    
                    // Kiểm tra nếu là dòng trống
                    if (line[0] === -1 && line[1] === -1) {
                        return (
                            <div 
                                key={`empty-${index}`} 
                                className="lyric-line empty-line"
                            >&nbsp;</div>
                        );
                    }

                    const lineWords = lyricsData.slice(line[0], line[1] + 1);
                    const isActiveLine = index === 1; // Dòng giữa luôn là active
                    
                    return (
                        <div
                            key={index}
                            className={`lyric-line ${isActiveLine ? 'active-line' : 'inactive-line'}`}
                        >
                            {lineWords.map((word, wordIndex) => {
                                const globalIndex = line[0] + wordIndex;
                                const isActive = isActiveLine && globalIndex === currentWordIndex;
                                const isPast = isActiveLine && globalIndex < currentWordIndex;
                                
                                return (
                                    <React.Fragment key={globalIndex}>
                                        <span
                                            className={`lyric-word ${
                                                isActive ? 'active' : 
                                                isPast ? 'past' : 
                                                'future'
                                            }`}
                                        >
                                            {word.text}
                                        </span>
                                        {wordIndex < lineWords.length - 1 && ' '}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Lyrics;
