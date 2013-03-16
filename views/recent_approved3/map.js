function(doc) {
  if (doc.timestamp && (doc.ios == 3) && (doc.approved==1)) {
      emit(doc.timestamp,doc) 
  }
};
