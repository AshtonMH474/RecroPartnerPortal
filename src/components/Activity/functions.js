export function clear(active,recent,setCards,setAllCards){
        let filtered;
        if(active == 'sheets'){
             filtered = recent?.filter((rec) => rec.__typename == 'Sheet')
        }else{
              filtered = recent?.filter((rec) => rec.__typename == 'Paper')
        }
        setCards(filtered)
        setAllCards(filtered)
         
       
 
    }


