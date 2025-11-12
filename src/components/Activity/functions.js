export function clear(active,recent,setCards,setAllCards){
        let filtered;
        if(active == 'sheets'){
             filtered = recent?.filter((rec) => rec.__typename == 'Sheet')
        }
        else if(active == 'statements'){
            filtered = recent?.filter((rec) => rec.__typename == 'Statements')
        }
        else{
              filtered = recent?.filter((rec) => rec.__typename == 'Paper')
        }
        setCards(filtered)
        setAllCards(filtered)
         
       
 
    }


