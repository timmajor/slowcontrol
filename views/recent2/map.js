function(doc) {
  if (doc.timestamp && (doc.ios == 2)) {
      emit(doc.timestamp,doc) 
  }
};
