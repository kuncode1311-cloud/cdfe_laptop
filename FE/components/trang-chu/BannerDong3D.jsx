"use client";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import styles from "./BannerDong3D.module.css";
// ==========================================
// 1. CẤU HÌNH HẰNG SỐ & DỮ LIỆU CINEMATIC
// ==========================================
// Tổng số lượng frame ảnh tạo nên chuỗi chuyển động 3D (768 frames)
const TOTAL = 768;
// Hàm tạo đường dẫn URL đến từng frame ảnh trong thư mục public
// Ví dụ: frame index 0 -> "/cinematic/frames/frame_00001.webp"
const pathFor = (i) => `/cinematic/frames/frame_${String(i + 1).padStart(5, "0")}.webp`;
// Hàm giới hạn giá trị n luôn nằm trong khoảng [0, 1]
const clamp = (n) => Math.max(0, Math.min(1, n));
// Dữ liệu nội dung 4 phân đoạn (Chapters) hiển thị theo tiến trình cuộn
const chapters = [
    [
        "01 / AWAKEN",
        "KHỞI ĐỘNG",
        "SỨC MẠNH",
        "Hiệu năng thế hệ mới.",
        "Sẵn sàng ngay khi bạn chạm tới.",
    ],
    [
        "02 / POWER",
        "SỨC MẠNH",
        "THỨC TỈNH",
        "Tốc độ phản hồi tức thì.",
        "Mọi chuyển động đều liền mạch.",
    ],
    [
        "03 / EVOLVE",
        "BỨT QUA",
        "GIỚI HẠN",
        "Thiết kế cho công việc.",
        "Tối ưu cho sáng tạo và gaming.",
    ],
    [
        "04 / EXPERIENCE",
        "SẴN SÀNG",
        "BỨT PHÁ",
        "Một trải nghiệm laptop mới.",
        "Mượt mà từ khung hình đầu tiên.",
    ],
];
// Nhãn nút kêu gọi hành động (CTA) cho từng phân cảnh
const actionLabels = [
    "KHÁM PHÁ THIẾT KẾ",
    "XEM SỨC MẠNH",
    "CHẠM VÀO HIỆU NĂNG",
    "TIẾP TỤC XEM SẢN PHẨM",
];
// Nhãn hiển thị trên thanh điều hướng các cảnh ở góc
const sceneLabels = ["THIẾT KẾ", "SỨC MẠNH", "BỨT PHÁ", "TRẢI NGHIỆM"];
// ==========================================
// 2. COMPONENT CHÍNH: BannerDong3D
// ==========================================
export default function BannerDong3D() {
    // Tham chiếu đến các phần tử DOM quan trọng
    const rootRef = useRef(null); // Khối bao ngoài cùng (xác định chiều cao cuộn)
    const stageRef = useRef(null); // Khối sân khấu hiển thị (Sticky ở giữa màn hình)
    const canvasRef = useRef(null); // Thẻ Canvas vẽ frame ảnh
    // Bộ nhớ đệm lưu các đối tượng Image HTML đã tải
    const images = useRef(new Map());
    // target: Tiến độ cuộn đích cần đạt tới (0 -> 1)
    const target = useRef(0);
    // shown: Tiến độ frame đang hiển thị thực tế trên canvas (dùng nội suy mượt mà)
    const shown = useRef(0);
    // Web Audio API: Bộ tạo âm thanh hiệu ứng điện ảnh tổng hợp (ambient / cinematic rumble)
    const audio = useRef(null);
    // ------------------------------------------------------------------
    // Hàm mở khóa & khởi tạo hệ thống âm thanh (Web Audio API)
    // Chỉ kích hoạt khi người dùng có tương tác đầu tiên (click, cuộn, phím)
    // ------------------------------------------------------------------
    const unlock = useCallback(() => {
        if (audio.current) {
            void audio.current.ctx.resume();
            return;
        }
        const AC = window.AudioContext;
        if (!AC)
            return;
        const ctx = new AC();
        // Tạo tiếng ồn trắng (white noise buffer)
        const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++)
            data[i] = Math.random() * 2 - 1;
        // Thiết lập các node xử lý âm thanh
        const source = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        const rumble = ctx.createOscillator();
        const rumbleGain = ctx.createGain();
        const compressor = ctx.createDynamicsCompressor();
        source.buffer = buffer;
        source.loop = true;
        filter.type = "bandpass";
        filter.Q.value = 0.72;
        filter.frequency.value = 900;
        gain.gain.value = 0;
        // Tạo âm trầm điện ảnh (rumble)
        rumble.type = "sine";
        rumble.frequency.value = 72;
        rumbleGain.gain.value = 0;
        compressor.threshold.value = -16;
        compressor.knee.value = 14;
        compressor.ratio.value = 5;
        // Kết nối chuỗi tín hiệu âm thanh
        source.connect(filter).connect(gain).connect(compressor);
        rumble.connect(rumbleGain).connect(compressor);
        compressor.connect(ctx.destination);
        source.start();
        rumble.start();
        audio.current = { ctx, gain, filter, rumble, rumbleGain };
        void ctx.resume();
    }, []);
    // ------------------------------------------------------------------
    // EFFECT 1: Tải trước (Pre-warm) toàn bộ frames vào bộ nhớ cache ngầm
    // Giúp người dùng khi cuộn nhanh không bị khựng hình
    // ------------------------------------------------------------------
    useEffect(() => {
        let cancelled = false;
        const warmFrameCache = async () => {
            // Giai đoạn 1: Nạp NGAY LẬP TỨC 30 frame đầu tiên (Chapter 1) với độ ưu tiên cao
            // Đảm bảo người dùng vừa vào trang lướt chuột là chuyển động 60fps mượt như nhung
            const initialFrames = Array.from({ length: 30 }, (_, i) => i);
            await Promise.all(
                initialFrames.map(f => {
                    load(f, "high");
                    return fetch(pathFor(f), { cache: "force-cache" }).catch(() => {});
                })
            );

            if (cancelled) return;

            // Nghỉ nhẹ 400ms để nhường băng thông cho các thành phần giao diện khác
            await new Promise((resolve) => window.setTimeout(resolve, 400));

            // Giai đoạn 2: Nạp ngầm toàn bộ frames còn lại (30 -> 767) theo luồng song song
            let cursor = 30;
            const worker = async () => {
                while (!cancelled) {
                    const frame = cursor++;
                    if (frame >= TOTAL)
                        return;
                    try {
                        await fetch(pathFor(frame), { cache: "force-cache" });
                    }
                    catch {
                        // Nếu lỗi nạp nền, bộ nạp trực tiếp sẽ tự fetch khi cần
                    }
                    if (frame % 8 === 0)
                        await new Promise((resolve) => window.setTimeout(resolve, 16));
                }
            };
            await Promise.all(Array.from({ length: 4 }, () => worker()));
        };
        // Tận dụng thời gian rảnh của CPU (requestIdleCallback)
        const hasIdleCallback = typeof window !== 'undefined' && 'requestIdleCallback' in window;
        const idleId = hasIdleCallback
            ? window.requestIdleCallback(() => void warmFrameCache(), {
                timeout: 1500,
            })
            : window.setTimeout(() => void warmFrameCache(), 300);
        return () => {
            cancelled = true;
            if (hasIdleCallback && 'cancelIdleCallback' in window) {
                window.cancelIdleCallback(idleId);
            }
            else {
                window.clearTimeout(idleId);
            }
        };
    }, []);
    // ------------------------------------------------------------------
    // EFFECT 2: XỬ LÝ LÕI - BẮT SỰ KIỆN CUỘN & VẼ FRAME 3D LÊN CANVAS
    // ------------------------------------------------------------------
    useEffect(() => {
        const root = rootRef.current;
        const stage = stageRef.current;
        const canvas = canvasRef.current;
        if (!root || !stage || !canvas)
            return;
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx)
            return;
        let raf = 0; // ID của requestAnimationFrame
        let lastFrame = -1; // Frame đã vẽ gần nhất
        let lastProgress = 0; // Tiến độ cuộn trước đó
        let desiredFrame = 0; // Frame mong muốn vẽ
        let scrollEnergy = 0; // Động năng cuộn (dùng chỉnh âm thanh)
        let scrollDirection = 1; // Hướng cuộn (1: xuống, -1: lên)
        let lastScrollY = window.scrollY; // Vị trí scrollY trước đó
        let heroActive = false; // Banner có đang trong tầm nhìn không
        let cinematicFocusActive = false; // Chế độ tập trung điện ảnh
        let lastTickTime = performance.now();
        let lastPrefetchedFrame = -1;
        let lastSeekFrame = -1;
        // Lấy danh sách các phần tử văn bản chapter và nút điều hướng
        const chapterElements = Array.from(stage.querySelectorAll("[data-cinematic-chapter]"));
        const navigationButtons = Array.from(stage.querySelectorAll("[data-scene-nav]"));
        // Hàm nội suy mượt bậc 3 (Smoothstep) để tạo hiệu ứng mờ dần (fade in/out) mượt mà
        const smoothstep = (from, to, value) => {
            const x = clamp((value - from) / (to - from));
            return x * x * (3 - 2 * x);
        };
        // Hàm tải ảnh của 1 frame cụ thể kèm cơ chế dọn dẹp RAM (LRU Cache tối đa 120 ảnh cho mượt mà)
        const load = (n, priority = "low") => {
            const i = Math.round(Math.max(0, Math.min(TOTAL - 1, n)));
            let img = images.current.get(i);
            if (!img) {
                // Nếu bộ nhớ đệm vượt quá 120 ảnh, xóa bớt ảnh ở xa frame hiện tại nhất
                if (images.current.size >= 120) {
                    const victim = [...images.current.keys()].reduce((furthest, key) => Math.abs(key - i) > Math.abs(furthest - i) ? key : furthest);
                    const oldImage = images.current.get(victim);
                    if (oldImage)
                        oldImage.src = "";
                    images.current.delete(victim);
                }
                img = new Image();
                img.decoding = "async";
                img.fetchPriority = priority;
                img.src = pathFor(i);
                images.current.set(i, img);
            }
            else if (priority === "high") {
                img.fetchPriority = "high";
            }
            return img;
        };
        // Hàm vẽ trực tiếp hình ảnh lên thẻ Canvas
        const draw = (img) => {
            const dpr = 1;
            const w = stage.clientWidth;
            const h = stage.clientHeight;
            // Cập nhật kích thước Canvas nếu kích thước khung nhìn thay đổi
            if (canvas.width !== Math.round(w * dpr) ||
                canvas.height !== Math.round(h * dpr)) {
                canvas.width = Math.round(w * dpr);
                canvas.height = Math.round(h * dpr);
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.fillStyle = "#02060b";
            ctx.fillRect(0, 0, w, h);
            ctx.drawImage(img, 0, 0, w, h);
        };
        // -------------------------------------------------------------
        // HÀM UPDATE: BẮT VỊ TRÍ CUỘN VÀ TÍNH TIẾN ĐỘ FRAME MỤC TIÊU
        // -------------------------------------------------------------
        const update = () => {
            const rect = root.getBoundingClientRect();
            const travel = Math.max(1, root.offsetHeight - innerHeight);
            // rawProgress: Tỷ lệ cuộn từ 0.0 -> 1.0
            const rawProgress = clamp(-rect.top / travel);
            const scrollDelta = window.scrollY - lastScrollY;
            // target.current: Tiến độ đích cần chuyển frame
            target.current = clamp(rawProgress / 0.86);
            const seekDirection = Math.sign(scrollDelta) || scrollDirection;
            if (scrollDelta !== 0)
                scrollDirection = seekDirection;
            // Tính số thứ tự frame tương ứng (0 -> 767)
            const seekFrame = Math.round(target.current * (TOTAL - 1));
            if (lastSeekFrame < 0 || Math.abs(seekFrame - lastSeekFrame) >= 6) {
                // Tải trước frame hiện tại và các frame liền kề với độ ưu tiên cao
                load(seekFrame, "high");
                load(seekFrame + seekDirection, "high");
                load(seekFrame - seekDirection, "high");
                lastSeekFrame = seekFrame;
            }
            // Xác định xem banner có đang nằm trong tầm nhìn chính của màn hình không
            heroActive = rect.top <= 64 && rect.bottom >= innerHeight;
            cinematicFocusActive =
                heroActive && (rawProgress > 0.001 || scrollDelta > 0);
            document.body.classList.toggle("cinematic-focus", cinematicFocusActive);
            // Tính toán năng lượng cuộn để điều chỉnh cường độ âm thanh
            if (heroActive && scrollDelta !== 0) {
                scrollEnergy = Math.min(1, Math.max(scrollEnergy, Math.abs(scrollDelta) / 90));
            }
            else if (!heroActive) {
                scrollEnergy = 0;
            }
            lastScrollY = window.scrollY;
        };
        // Tìm frame gần nhất đã tải xong nếu frame hiện tại chưa kịp load
        const closestReadyFrame = (wantedFrame) => {
            let closest = null;
            for (const [frame, image] of images.current) {
                if (!image.complete || !image.naturalWidth)
                    continue;
                if (!closest ||
                    Math.abs(frame - wantedFrame) < Math.abs(closest.frame - wantedFrame))
                    closest = { frame, image };
            }
            return closest;
        };
        // -------------------------------------------------------------
        // HÀM TICK: VÒNG LẶP RENDER MƯỢT MÀ (requestAnimationFrame)
        // -------------------------------------------------------------
        const tick = (now) => {
            const elapsedFrames = Math.min(2.5, Math.max(0.5, (now - lastTickTime) / 16.67));
            lastTickTime = now;
            // Nội suy chuyển động mượt (Lerp/Easing) giữa frame hiện tại và frame đích
            const diff = target.current - shown.current;
            const easedStep = diff * 0.065;
            const maxStep = (6 * elapsedFrames) / (TOTAL - 1);
            shown.current +=
                Math.sign(easedStep) * Math.min(Math.abs(easedStep), maxStep);
            if (Math.abs(diff) < 0.00015)
                shown.current = target.current;
            const p = clamp(shown.current);
            stage.style.setProperty("--timeline", String(p));
            // Cập nhật hiệu ứng xuất hiện/biến mất của từng dòng chữ Chapter theo tiến độ cuộn
            chapterElements.forEach((chapter, index) => {
                const local = p * chapters.length - index;
                const enter = index === 0 ? 1 : smoothstep(0.02, 0.18, local);
                const exit = index === chapters.length - 1 ? 1 : 1 - smoothstep(0.78, 0.98, local);
                const visibility = clamp(Math.min(enter, exit));
                const offset = local < 0.5 ? (1 - enter) * 72 : (1 - exit) * -72;
                chapter.style.setProperty("--chapter-opacity", String(visibility));
                chapter.style.setProperty("--chapter-offset", `${offset}px`);
                chapter.style.setProperty("--chapter-blur", `${(1 - visibility) * 7}px`);
                chapter.style.setProperty("--chapter-line", String(smoothstep(0.12, 0.38, local) * exit));
                chapter.style.setProperty("--chapter-local", String(clamp(local)));
            });
            // Cập nhật trạng thái active cho nút điều hướng cảnh
            const activeChapter = Math.min(chapters.length - 1, Math.floor(p * chapters.length));
            stage.style.setProperty("--nav-opacity", String(1 - smoothstep(0.91, 0.98, p)));
            navigationButtons.forEach((button, index) => {
                button.dataset.active = String(index === activeChapter);
                button.setAttribute("aria-current", index === activeChapter ? "step" : "false");
            });
            // Lấy ảnh frame tương ứng và vẽ lên Canvas
            const frame = Math.round(p * (TOTAL - 1));
            const img = load(frame, "high");
            desiredFrame = frame;
            if (frame !== lastFrame && img.complete && img.naturalWidth) {
                draw(img);
                lastFrame = frame;
            }
            else if (!img.complete) {
                img.onload = () => {
                    if (desiredFrame === frame) {
                        draw(img);
                        lastFrame = frame;
                    }
                };
            }
            const direction = p >= lastProgress ? 1 : -1;
            if (!img.complete) {
                const fallback = closestReadyFrame(frame);
                if (fallback && fallback.frame !== lastFrame) {
                    draw(fallback.image);
                    lastFrame = fallback.frame;
                }
            }
            // Tải trước các frame tiếp theo theo chiều người dùng đang cuộn
            if (frame !== lastPrefetchedFrame) {
                for (let i = 1; i <= 7; i++)
                    load(frame + i * direction, "low");
                for (let i = 1; i <= 2; i++)
                    load(frame - i * direction, "low");
                lastPrefetchedFrame = frame;
            }
            // Cập nhật âm lượng và tần số âm thanh theo tốc độ cuộn
            const motion = heroActive ? scrollEnergy : 0;
            if (audio.current) {
                const now = audio.current.ctx.currentTime;
                audio.current.gain.gain.setTargetAtTime(motion * 0.2, now, 0.035);
                audio.current.filter.frequency.setTargetAtTime(820 + motion * 3900, now, 0.045);
                audio.current.rumbleGain.gain.setTargetAtTime(motion * 0.055, now, 0.05);
                audio.current.rumble.frequency.setTargetAtTime(66 + motion * 38 + (scrollDirection > 0 ? 8 : 0), now, 0.06);
            }
            scrollEnergy *= heroActive ? 0.78 : 0;
            lastProgress = p;
            // Tiếp tục vòng lặp animation
            raf = requestAnimationFrame(tick);
        };
        // Vẽ frame đầu tiên ngay khi tải xong
        const first = load(0, "high");
        first.onload = () => {
            if (desiredFrame === 0)
                draw(first);
        };
        if (first.complete && first.naturalWidth)
            draw(first);
        // Xử lý sự kiện lăn con trỏ chuột (Wheel)
        const wheel = (event) => {
            unlock();
            if (!heroActive)
                return;
            scrollDirection = Math.sign(event.deltaY) || scrollDirection;
            scrollEnergy = Math.min(1, Math.max(scrollEnergy, Math.abs(event.deltaY) / 180));
        };
        // Xử lý vị trí con trỏ chuột để tạo hiệu ứng thị sai (Parallax / 3D Tilt)
        const pointerMove = (event) => {
            stage.style.setProperty("--pointer-x", String((event.clientX / innerWidth - 0.5) * 2));
            stage.style.setProperty("--pointer-y", String((event.clientY / innerHeight - 0.5) * 2));
        };
        const pointerLeave = () => {
            stage.style.setProperty("--pointer-x", "0");
            stage.style.setProperty("--pointer-y", "0");
        };
        // -------------------------------------------------------------
        // ĐĂNG KÝ LẮNG NGHE CÁC SỰ KIỆN TRÌNH DUYỆT (Scroll, Resize, v.v.)
        // -------------------------------------------------------------
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update, { passive: true });
        window.addEventListener("wheel", wheel, { passive: true });
        window.addEventListener("pointerdown", unlock, { passive: true });
        window.addEventListener("touchstart", unlock, { passive: true });
        window.addEventListener("keydown", unlock);
        stage.addEventListener("pointermove", pointerMove, { passive: true });
        stage.addEventListener("pointerleave", pointerLeave);
        // Khởi chạy lần đầu
        update();
        raf = requestAnimationFrame(tick);
        // Hủy đăng ký sự kiện khi component unmount (dọn dẹp bộ nhớ)
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
            window.removeEventListener("wheel", wheel);
            window.removeEventListener("pointerdown", unlock);
            window.removeEventListener("touchstart", unlock);
            window.removeEventListener("keydown", unlock);
            stage.removeEventListener("pointermove", pointerMove);
            stage.removeEventListener("pointerleave", pointerLeave);
            document.body.classList.remove("cinematic-focus");
            if (audio.current)
                void audio.current.ctx.close();
            audio.current = null;
        };
    }, [unlock]);
    // ------------------------------------------------------------------
    // HÀM ĐIỀU HƯỚNG NHANH ĐẾN MỘT PHÂN ĐOẠN (CHAPTER) KHI CLICK NÚT
    // ------------------------------------------------------------------
    const goToChapter = (index) => {
        const root = rootRef.current;
        if (!root)
            return;
        // Nếu đã ở cảnh cuối cùng thì cuộn xuống mục Flash Sale bên dưới
        if (index >= chapters.length) {
            const nextSection = document.getElementById("flash-sale");
            if (nextSection)
                nextSection.scrollIntoView({ behavior: "smooth" });
            else
                window.scrollTo({
                    top: window.scrollY + root.getBoundingClientRect().bottom,
                    behavior: "smooth",
                });
            return;
        }
        // Tính toán tọa độ cuộn của Chapter tương ứng và cuộn mượt tới đó
        const rootTop = window.scrollY + root.getBoundingClientRect().top;
        const travel = Math.max(1, root.offsetHeight - window.innerHeight);
        const chapterProgress = (index + 0.5) / chapters.length;
        window.scrollTo({
            top: rootTop + travel * chapterProgress * 0.86,
            behavior: "smooth",
        });
    };
    // ------------------------------------------------------------------
    // 3. GIAO DIỆN HIỂN THỊ JSX
    // ------------------------------------------------------------------
    return (<section ref={rootRef} className={styles.cinematic} aria-label="Trải nghiệm laptop điện ảnh">
      <div ref={stageRef} className={styles.stage}>
        {/* Thẻ Canvas hiển thị các frame ảnh 3D */}
        <canvas ref={canvasRef} className={styles.canvas}/>

        {/* Lớp phủ chuyển màu viền (Edge Blend) tạo chiều sâu điện ảnh */}
        <div className={styles.edgeBlend}/>

        {/* Danh sách 4 phân đoạn chữ & nút CTA */}
        {chapters.map((c, i) => (<article key={c[0]} className={styles.chapter} data-cinematic-chapter>
            <div className={styles.leftCopy}>
              <p>{c[0]}</p>
              <h1>
                <span>{c[1]}</span>
                <span>{c[2]}</span>
              </h1>
              <i />
              <button className={styles.cta} type="button" onClick={() => goToChapter(i + 1)}>
                {actionLabels[i]} <ArrowRight size={15}/>
              </button>
            </div>
            <div className={styles.rightCopy}>
              <span>{c[3]}</span>
              <span>{c[4]}</span>
            </div>
          </article>))}

        {/* Thanh điều hướng chọn nhanh từng cảnh bên phải */}
        <nav className={styles.sceneNav} aria-label="Điều hướng các cảnh laptop">
          {chapters.map((chapter, index) => (<button key={chapter[0]} type="button" data-scene-nav data-active={index === 0} aria-label={`Đi đến cảnh ${index + 1}`} onClick={() => goToChapter(index)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <em>{sceneLabels[index]}</em>
            </button>))}
        </nav>
      </div>
    </section>);
}
