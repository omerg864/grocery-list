import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import './SwipeItem.css';
import { useRef } from 'react';


interface SwipeItemProps {
    children: React.ReactNode
    onSwipedLeft?: (id: string|number) => void
    onSwipedRight?: (id: string|number) => void
    animateDivClass: string
    id: string|number
    threshold?: number
    leftBtnClass?: string
    rightBtnClass?: string
    leftBtnChildren?: React.ReactNode
    rightBtnChildren?: React.ReactNode
    leftBtnOpenWidth?: number
    rightBtnOpenWidth?: number
}
function SwipeItem(props: SwipeItemProps) {

    const rightBtn = useRef<HTMLDivElement>(null);
    const leftBtn = useRef<HTMLDivElement>(null);
    const threshold = props.threshold || 0.3;
    const leftBtnOpenWidth = props.leftBtnOpenWidth || 60;
    const rightBtnOpenWidth = props.rightBtnOpenWidth || 60;

    const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
    const [{ w }, set] = useSpring(() => ({ w: 0 }));
    const [{ w2 }, set2] = useSpring(() => ({ w2: 0 }));
    // Set the drag hook and define component movement based on gesture data
    const bind = useGesture(({
        onDrag: ({ down, movement: [mx, _my] }) => {
            if(down && x.get() != 0) {
                x.set(0);
            }
          if(down && mx < -0.5) {
            leftBtn.current?.classList.remove('show');
            rightBtn.current?.classList.add('show');
            w.set(-mx);
            api.start({ x: down ? mx : 0, y: 0, immediate: down })
          }
          else if (down && mx > 0.5) {
            rightBtn.current?.classList.remove('show');
            leftBtn.current?.classList.add('show');
            w2.set(mx);
            api.start({ x: down ? mx : 0, y: 0, immediate: down })
          }
        },
        onDragEnd: ({ _down, movement: [mx, _my] }) => {
            if( mx > 0.8 * document.documentElement.clientWidth) {
                props.onSwipedRight!(props.id);
                api.start({x: 0, y: 0});
                set2.start({ w2: 0 });
            } else if (mx < -0.8 * document.documentElement.clientWidth) {
                props.onSwipedLeft!(props.id);
                api.start({x: 0, y: 0});
                set.start({w: 0});
            } else if (mx > threshold * document.documentElement.clientWidth) {
                api.start({ x: leftBtnOpenWidth, y: 0 });
                set2.start({ w2: leftBtnOpenWidth });
            } else if (mx < -threshold * document.documentElement.clientWidth) {
                api.start({ x: -rightBtnOpenWidth, y: 0 });
                set.start({ w: rightBtnOpenWidth });
            } else {
                api.start({ x: 0, y: 0 });
                set.start({ w: 0 });
                set2.start({ w2: 0 });
            }
        }
      }))

  return (
    <div style={{display: 'flex', position: 'relative', width: '100%', overflow: 'hidden'}}>
        {props.onSwipedRight && <animated.div style={{ width: w2, touchAction: 'none'}} ref={leftBtn} className={`swipe-right ${props.leftBtnClass}`} onClick={() => props.onSwipedRight!(props.id)}>
        {props.leftBtnChildren}
            </animated.div>}
        <animated.div className={props.animateDivClass} {...bind()} style={{ x, y, touchAction: 'none' }} >
            {props.children}
        </animated.div>
        {props.onSwipedLeft && <animated.div style={{ width: w, touchAction: 'none'}} ref={rightBtn} className={`swipe-left ${props.rightBtnClass}`} onClick={() => props.onSwipedLeft!(props.id)}>
            {props.rightBtnChildren}
            </animated.div>}
    </div>
  )
}

export default SwipeItem