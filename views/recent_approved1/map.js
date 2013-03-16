function(doc) {
  if (doc.timestamp && (doc.ios == 1) && (doc.approved==1)) {
      emit(doc.timestamp,doc) 
  }
};
