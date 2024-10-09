#include: amsmath
#include: bm
#include: float
#include: upgreek
#include: tabularray
#include: calc
#include: etoolbox

\Romannumeral{num}
\cmplen{len1}{len2}{larger command}{smaller command}
\framed[标题]{内容}[注释]
\framed{内容}
\framed[标题]{内容}
\framed{内容}[注释]
\notframed[标题]{内容}[注释]
\notframed[标题]{内容}
\notframed{内容}[注释]
\notframed{内容}

\xstyle{xlabel}
\xstyle{xlabel}[xmin][xmax]
\ystyle{ylabel}
\ystyle{ylabel}[ymin][ymax]

\begin{plot}{xystyle}
\begin{plot}{xystyle}*
\begin{plot}{xystyle}[width= ,height= ]
\begin{plot}{xystyle}[width= ,height= ]*
\end{plot}

\datapoint[color]{data}[legend]
\datapoint[color]{data}
\datapoint{data}[legend]
\datapoint{data}
\functionline{domain}{function}[legend]
\functionline{domain}{function}