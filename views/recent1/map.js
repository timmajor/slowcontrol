function(doc) {
  if (doc.timestamp && (doc.ios == 1)) {
      emit(doc.timestamp,doc) 
  }
};
