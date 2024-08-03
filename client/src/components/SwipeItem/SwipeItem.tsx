import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import './SwipeItem.css';
import { useEffect, useRef, useState } from 'react';


interface SwipeItemProps {
    children: React.ReactNode;
    mainItemClick?: () => void;
    onSwipedLeft?: (id: string) => void;
    onSwipedRight?: (id: string) => void;
    animateDivClass?: string;
    id: string;
    threshold?: number;
    leftBtnClass?: string;
    rightBtnClass?: string;
    leftBtnChildren?: React.ReactNode;
    rightBtnChildren?: React.ReactNode;
    leftBtnOpenWidth?: number;
    rightBtnOpenWidth?: number;
    fullSwipe?: boolean;
    open?: string | null;
    setOpen?: (id: string | null) => void;
}
function SwipeItem(props: SwipeItemProps) {

    const rightBtn = useRef<HTMLDivElement>(null);
    const leftBtn = useRef<HTMLDivElement>(null);
    const threshold = props.threshold || 0.3;
    const leftBtnOpenWidth = props.leftBtnOpenWidth || 60;
    const rightBtnOpenWidth = props.rightBtnOpenWidth || 60;
    const fullSwipe = props.fullSwipe === undefined ? true : props.fullSwipe;

    const [swipeState, setSwipeState] = useState<number>(0);

    const [{ x }, api] = useSpring(() => ({ x: 0 }));
    const [{ w }, set] = useSpring(() => ({ w: 0 }));
    const [{ w2 }, set2] = useSpring(() => ({ w2: 0 }));
    // Set the drag hook and define component movement based on gesture data
    const bind = useGesture({
        onDrag: ({ down, movement: [mx, _my], axis}) => {
            if (axis !== 'x') return;
            if(down && x.get() != 0) {
                x.set(0);
            }
          if(down && mx < -0.5 && props.onSwipedLeft) {
            leftBtn.current?.classList.remove('show');
            rightBtn.current?.classList.add('show');
            w.set(-mx);
            api.start({ x: down ? mx : 0, immediate: down });
            if (props.open !== props.id) {
                props.setOpen!(null);
            }
          }
          else if (down && mx > 0.5 && props.onSwipedRight) {
            rightBtn.current?.classList.remove('show');
            leftBtn.current?.classList.add('show');
            w2.set(mx);
            api.start({ x: down ? mx : 0, immediate: down });
            if (props.open !== props.id) {
                props.setOpen!(null);
            }
          }
        },
        onDragEnd: ({ movement: [mx, _my] }) => {
            if( mx > 0.8 * document.documentElement.clientWidth && props.onSwipedRight && fullSwipe) {
                props.onSwipedRight!(props.id);
                api.start({x: 0 });
                set2.start({ w2: 0 });
                setSwipeState(0);
                props.setOpen!(null);
            } else if (mx < -0.8 * document.documentElement.clientWidth && props.onSwipedLeft && fullSwipe) {
                props.onSwipedLeft!(props.id);
                api.start({x: 0});
                set.start({w: 0});
                setSwipeState(0);
                props.setOpen!(null);
            } else if (mx > threshold * document.documentElement.clientWidth && props.onSwipedRight) {
                api.start({ x: leftBtnOpenWidth });
                set2.start({ w2: leftBtnOpenWidth });
                setSwipeState(1);
                props.setOpen!(props.id);
            } else if (mx < -threshold * document.documentElement.clientWidth && props.onSwipedLeft) {
                api.start({ x: -rightBtnOpenWidth});
                set.start({ w: rightBtnOpenWidth });
                setSwipeState(2);
                props.setOpen!(props.id);
            } else if(mx > 2 || mx < -2) {
                api.start({ x: 0 });
                set.start({ w: 0 });
                set2.start({ w2: 0 });
                setSwipeState(0);
            } else {
                if(props.mainItemClick) {
                    if (swipeState === 0 && props.open === null) {
                        props.mainItemClick();
                    }
                }
                api.start({ x: 0 });
                set.start({ w: 0 });
                set2.start({ w2: 0 });
                setSwipeState(0);
                props.setOpen!(null);
            }
        },
    }, { drag: { axis: 'lock' } });

    useEffect(() => {
        if (props.open !== props.id) {
            api.start({ x: 0 });
            set.start({ w: 0 });
            set2.start({ w2: 0 });
            setSwipeState(0);
        }
    }, [props.open])

  return (
    <div style={{display: 'flex', position: 'relative', width: '100%', overflow: 'hidden', touchAction: 'pan-y'}}>
        {props.onSwipedRight && <animated.div style={{ width: w2, touchAction: 'none'}} ref={leftBtn} className={`swipe-right ${props.leftBtnClass}`} onClick={() => props.onSwipedRight!(props.id)}>
        {props.leftBtnChildren}
            </animated.div>}
        <animated.div className={props.animateDivClass} {...bind()} style={{ x, touchAction: 'none' }} >
            {props.children}
        </animated.div>
        {props.onSwipedLeft && <animated.div style={{ width: w, touchAction: 'none'}} ref={rightBtn} className={`swipe-left ${props.rightBtnClass}`} onClick={() => props.onSwipedLeft!(props.id)}>
            {props.rightBtnChildren}
            </animated.div>}
    </div>
  )
}

export default SwipeItem