function lineMP( a = {x, y}, b = {x, y} ) {

    let oct = 0;

    const p0 = Object.assign( {}, a );
    const p1 = Object.assign( {}, b );
    const vector = [];

    // p0.x, p0.y, p1.x and p1.y must be integers
    if ( allIntegers( p0, p1 ) ) {
        
        // detect whether p1.x > p0.x or p1.y > p0.y and reverse the input coordinates
        if ( Math.abs( p1.y - p0.y ) < Math.abs( p1.x - p0.x ) ) {

            if ( p1.x < p0.x ) switchPoints( p0, p1 );
        }
        else {

            if ( p1.y < p0.y ) switchPoints( p0, p1 );
        }

        let x = p0.x, y = p0.y;

        let d;
        let incrS; // simple increment - increment x or y
        let incrD; // double increment - increment both x and y

        let dx = p1.x - p0.x;
        let dy = p1.y - p0.y;

        // slope
        const m = dy / dx;

        // increments on x and y
        let xi, yi;

        // The start point
        vector.push( p0 );

        // 1st octant
        if ( m >= 0 && m <= 1 ) oct = 1;

        // 2nd octant
        else if ( m > 1 ) oct = 2;

        // 3rd octant
        else if ( m < 0 && Math.abs( m ) >= 1 ) oct = 3;

        // 4th octant
        else if ( m < 0 && Math.abs( m ) < 1 ) oct = 4;


        switch ( oct ) {

            case 1:
            case 4:
                if ( dy < 0 ) {
                    yi = -1;
                    dy = -dy;
                }
                else yi = 1;
                
                d = 2 * dy - dx;
                incrS = 2 * dy;
                incrD = 2 * ( dy - dx );

                while ( x < p1.x ) {

                    // Choose incrD
                    if ( d >= 0 ) {
                        d += incrD;
                        x++;
                        y += yi;
                    }
                    // Choose incrS
                    else {
                        d += incrS;
                        x++;
                    }
    
                    // Push selected point closest to the line
                    vector.push( { x, y } );
                }
                break;

            case 2:
            case 3:
                if ( dx < 0 ) {
                    xi = -1;
                    dx = -dx;
                }
                else xi = 1;

                d = 2 * dx - dy;
                incrS = 2 * dx;
                incrD = 2 * ( dx - dy );

                while ( y < p1.y ) {

                    // Choose incrD
                    if ( d >= 0 ) {
                        d += incrD;
                        y++;
                        x += xi;
                    }
                    // Choose incrS
                    else {
                        d += incrS;
                        y++;
                    }
    
                    // Push selected point closest to the line
                    vector.push( { x, y } );
                }
                break;
        
            default:
                break;
        }
    }

    return vector;
}

// returns true if a.x, a.y, b.x and b.y are integers, false otherwise
function allIntegers( a = {x, y}, b = {x, y} ) {

    return ( Number.isInteger(a.x) && 
             Number.isInteger(a.y) &&
             Number.isInteger(b.x) &&
             Number.isInteger(b.y) ) ? true : false;
}

function switchPoints( p0, p1 ) {
    const aux = { x: p0.x, y: p0.y };

    p0.x = p1.x;
    p0.y = p1.y;

    p1.x = aux.x;
    p1.y = aux.y; 
}

export { lineMP };