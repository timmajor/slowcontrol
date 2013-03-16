function(doc) {
  if (doc.timestamp && (doc.ios == 2) && (doc.approved==1)) {
      emit(doc.timestamp,doc) 
  }
};
