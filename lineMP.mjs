function lineMP( a = {x, y}, b = {x, y} ) {
    let vector = [];

    // a.x, a.y, b.x and b.y must be integers
    if ( allIntegers( a, b ) ) {
        
        // slope (declive)
        const m = ( b.y - a.y ) / ( b.x - a.x );  
        
        // if b.x < a.x switch point a with b
        if (b.x < a.x) {
            transform1( a, b );
        }
        
        if ( m >= 0 && m <= 1 ) {

            vector = lineMPAlgorithm( a, b );
        }
        else if ( m < 0 && m >= -1 ) {

            transform2( a, b );
 
            vector = lineMPAlgorithm( a, b );
            
            vector.forEach(p => transform2( vector[0], p ) );
        } 
        else if ( m > 1 ) {

            transform3( a, b );

            vector = lineMPAlgorithm( a, b );

            vector.forEach(p => transform3( vector[0], p ) );
        }
        else if ( m < -1 ) {

            transform4( a, b );
            transform2( a, b );

            vector = lineMPAlgorithm( a, b );

            vector.forEach(p => transform2( vector[0], p ) );
            vector.forEach(p => transform4( vector[0], p ) );
        }
    }

    return vector;
}

// Midpoint Line Algorithm
function lineMPAlgorithm( a = {x, y}, b = {x, y} ) {
    const vector = [];

    const dx = b.x - a.x;
    const dy = b.y - a.y;
    let d = 2 * dy - dx;
    
    const incrE = 2 * dy;
    const incrNE = 2 * ( dy - dx );
    
    let x = a.x;
    let y = a.y;

    // The start point
    vector.push(a);

    while ( x < b.x ) {
        // Choose E (East)
        if ( d <= 0 ) {
            d += incrE;
            x++;
        }
        // Choose NE (North East)
        else {
            d += incrNE;
            x++;
            y++;
        }
        
        // Push selected point closest to the line
        vector.push( { x, y } );
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

// switch point a with b
function transform1( a = {x, y}, b = {x, y} ) {

    const aux = {x: a.x, y: a.y};

    a.x = b.x;
    a.y = b.y;

    b.x = aux.x;
    b.y = aux.y;  
}

// transform point B so that the slope of line segment AB is in the range 0 <= m <= 1
// inicial slope must be in range -1 <= m < 0
function transform2( a = {x, y}, b = {x, y} ) {

    b.y = ( 2 * a.y ) - b.y;
    
    return b;
}

// transform point B so that the slope of line segment AB is in the range 0 <= m <= 1 
// inicial slope must be in range m > 1
function transform3( a = {x, y}, b = {x, y} ) {

    const dx = b.x - a.x;
    const dy = b.y - a.y;

    b.x = a.x + dy;
    b.y = a.y + dx;
    
    return b;
}

// transform point B so that the slope of line segment AB is in the range -1 <= m < 0
// inicial slope must be in range m < -1
function transform4( a = {x, y}, b = {x, y} ) {

    const dx = b.x - a.x;
    const dy = b.y - a.y;

    b.x = a.x - dy;
    b.y = a.y - dx;
    
    return b;
}

export { lineMP };