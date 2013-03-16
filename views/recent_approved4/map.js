function(doc) {
  if (doc.timestamp && (doc.ios == 4) && (doc.approved==1)) {
      emit(doc.timestamp,doc) 
  }
};
